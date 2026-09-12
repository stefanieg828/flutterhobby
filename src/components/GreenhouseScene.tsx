import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react'
import type { Hobby } from '../types'
import { ThemeObjectArt } from './ThemeObjectArt'
import './GreenhouseScene.css'

export type CarryPhase =
  | 'idle'
  | 'walkingToShelf'
  | 'pickingUp'
  | 'walkingToBench'
  | 'atBench'
  | 'returning'

export interface GreenhouseSceneHandle {
  startCarry: (hobbyId: string) => boolean
  startReturn: () => void
  isBusy: () => boolean
  phase: CarryPhase
  carriedId: string | null
}

const IDLE_POS = { x: 48, y: 58 }
const BENCH_FALLBACK = { x: 78, y: 72 }
const WALK_MS = 900
const PICKUP_MS = 320
const RETURN_MS = 850

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function percentInRoom(target: DOMRect, room: DOMRect): { x: number; y: number } {
  const cx = target.left + target.width / 2
  const cy = target.top + target.height * 0.55
  return {
    x: ((cx - room.left) / room.width) * 100,
    y: ((cy - room.top) / room.height) * 100,
  }
}

interface GreenhouseSceneProps {
  roomRef: React.RefObject<HTMLElement | null>
  hobbies: Hobby[]
  sparkles?: boolean
  onArriveAtBench: (hobbyId: string) => void
  onReturned?: () => void
  /** Notify Home which shelf pot is off the shelf (for hide). */
  onCarriedChange?: (hobbyId: string | null) => void
}

export const GreenhouseScene = forwardRef<GreenhouseSceneHandle, GreenhouseSceneProps>(
  function GreenhouseScene(
    { roomRef, hobbies, sparkles = false, onArriveAtBench, onReturned, onCarriedChange },
    ref,
  ) {
    const [phase, setPhase] = useState<CarryPhase>('idle')
    const [carriedId, setCarriedId] = useState<string | null>(null)
    const [holding, setHolding] = useState(false)
    const [pos, setPos] = useState({ x: IDLE_POS.x, y: IDLE_POS.y })
    const [facingLeft, setFacingLeft] = useState(false)
    const [transitionMs, setTransitionMs] = useState(WALK_MS)
    const timers = useRef<number[]>([])
    const phaseRef = useRef<CarryPhase>('idle')
    const carriedRef = useRef<string | null>(null)
    const shelfAnchorRef = useRef<{ x: number; y: number } | null>(null)
    const posRef = useRef(pos)

    const clearTimers = useCallback(() => {
      for (const t of timers.current) window.clearTimeout(t)
      timers.current = []
    }, [])

    const schedule = useCallback((fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms)
      timers.current.push(id)
      return id
    }, [])

    useEffect(() => {
      phaseRef.current = phase
    }, [phase])

    useEffect(() => {
      carriedRef.current = carriedId
      onCarriedChange?.(carriedId)
    }, [carriedId, onCarriedChange])

    useEffect(() => {
      posRef.current = pos
    }, [pos])

    useEffect(() => () => clearTimers(), [clearTimers])

    const measureShelf = useCallback(
      (hobbyId: string): { x: number; y: number } | null => {
        const room = roomRef.current
        if (!room) return null
        const tile = room.querySelector(
          `[data-hobby-id="${CSS.escape(hobbyId)}"]`,
        ) as HTMLElement | null
        if (!tile) return null
        return percentInRoom(tile.getBoundingClientRect(), room.getBoundingClientRect())
      },
      [roomRef],
    )

    const measureBench = useCallback((): { x: number; y: number } => {
      const room = roomRef.current
      if (!room) return BENCH_FALLBACK
      const bench = room.querySelector('[data-bench-anchor]') as HTMLElement | null
      if (!bench) return BENCH_FALLBACK
      return percentInRoom(bench.getBoundingClientRect(), room.getBoundingClientRect())
    }, [roomRef])

    const startCarry = useCallback(
      (hobbyId: string): boolean => {
        if (phaseRef.current !== 'idle' && phaseRef.current !== 'atBench') {
          return false
        }
        if (phaseRef.current === 'atBench' && carriedRef.current === hobbyId) {
          onArriveAtBench(hobbyId)
          return true
        }

        if (prefersReducedMotion()) {
          clearTimers()
          setCarriedId(hobbyId)
          setHolding(false)
          setPhase('atBench')
          setPos({ x: IDLE_POS.x, y: IDLE_POS.y })
          onArriveAtBench(hobbyId)
          return true
        }

        clearTimers()
        const shelf = measureShelf(hobbyId) ?? { x: 18, y: 42 }
        shelfAnchorRef.current = shelf
        setCarriedId(hobbyId)
        setHolding(false)
        setFacingLeft(shelf.x < IDLE_POS.x)
        setTransitionMs(WALK_MS)
        setPhase('walkingToShelf')
        setPos({ x: IDLE_POS.x, y: IDLE_POS.y })
        schedule(() => {
          setPos({ x: shelf.x, y: shelf.y })
        }, 16)

        schedule(() => {
          setPhase('pickingUp')
          setHolding(true)
          schedule(() => {
            const bench = measureBench()
            setFacingLeft(bench.x < shelf.x)
            setTransitionMs(WALK_MS)
            setPhase('walkingToBench')
            setPos({ x: bench.x, y: bench.y })
            schedule(() => {
              setPhase('atBench')
              onArriveAtBench(hobbyId)
            }, WALK_MS + 40)
          }, PICKUP_MS)
        }, WALK_MS + 40)

        return true
      },
      [clearTimers, measureBench, measureShelf, onArriveAtBench, schedule],
    )

    const startReturn = useCallback(() => {
      const id = carriedRef.current
      if (!id) {
        setPhase('idle')
        setHolding(false)
        setCarriedId(null)
        setPos({ x: IDLE_POS.x, y: IDLE_POS.y })
        onReturned?.()
        return
      }

      if (prefersReducedMotion()) {
        clearTimers()
        setHolding(false)
        setCarriedId(null)
        setPhase('idle')
        setPos({ x: IDLE_POS.x, y: IDLE_POS.y })
        onReturned?.()
        return
      }

      clearTimers()
      const shelf = shelfAnchorRef.current ?? measureShelf(id) ?? { x: 18, y: 42 }
      const from = posRef.current
      setHolding(true)
      setFacingLeft(shelf.x < from.x)
      setTransitionMs(RETURN_MS)
      setPhase('returning')
      setPos({ x: shelf.x, y: shelf.y })

      schedule(() => {
        setHolding(false)
        setCarriedId(null)
        setFacingLeft(IDLE_POS.x < shelf.x)
        setTransitionMs(WALK_MS)
        setPos({ x: IDLE_POS.x, y: IDLE_POS.y })
        schedule(() => {
          setPhase('idle')
          onReturned?.()
        }, WALK_MS + 40)
      }, RETURN_MS + 40)
    }, [clearTimers, measureShelf, onReturned, schedule])

    useImperativeHandle(
      ref,
      () => ({
        startCarry,
        startReturn,
        isBusy: () => {
          const p = phaseRef.current
          return p !== 'idle' && p !== 'atBench'
        },
        get phase() {
          return phaseRef.current
        },
        get carriedId() {
          return carriedRef.current
        },
      }),
      [startCarry, startReturn],
    )

    const hobby = carriedId ? hobbies.find((h) => h.id === carriedId) : null
    const base = import.meta.env.BASE_URL
    // One clean Sprout for every phase — never swap to the buddy lineup vignette
    const sproutSrc = `${base}art/greenhouse/sprout-idle.png`

    const busy = phase !== 'idle' && phase !== 'atBench'
    const aria =
      phase === 'idle'
        ? 'Sprout waiting in the greenhouse'
        : phase === 'atBench'
          ? 'Sprout at the potting bench'
          : 'Sprout carrying a plant'

    return (
      <>
        <div className="gh-sprout-fog" aria-hidden="true" />

        <div
          className={`gh-actor gh-actor--${phase}${facingLeft ? ' gh-actor--flip' : ''}${
            sparkles ? ' gh-actor--sparkle' : ''
          }`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transitionDuration: `${transitionMs}ms`,
          }}
          aria-label={aria}
          aria-busy={busy}
          data-carry-phase={phase}
        >
          <div className="gh-actor__body">
            <SproutSprite src={sproutSrc} />
            {holding && hobby ? (
              <span className="gh-actor__plant" aria-hidden="true">
                <ThemeObjectArt
                  theme="Greenhouse"
                  id={hobby.id}
                  status={hobby.status}
                  color={hobby.color ?? 'sage'}
                  size={42}
                  heart={hobby.status === 'proud-shelf'}
                />
              </span>
            ) : null}
            {sparkles && phase === 'idle' ? (
              <svg className="gh-actor__sparkles" viewBox="0 0 80 60" aria-hidden="true">
                <g fill="#f5d76e" stroke="#c4a24e" strokeWidth="0.8">
                  <path d="M18 28 L20 22 L22 28 L28 30 L22 32 L20 38 L18 32 L12 30 Z" />
                  <path d="M42 14 L43.5 10 L45 14 L49 15.5 L45 17 L43.5 21 L42 17 L38 15.5 Z" />
                  <path d="M58 34 L59.5 30 L61 34 L65 35.5 L61 37 L59.5 41 L58 37 L54 35.5 Z" />
                </g>
              </svg>
            ) : null}
          </div>
        </div>
      </>
    )
  },
)


function SproutSprite({ src }: { src: string }) {
  return (
    <img
      className="gh-actor__sprite"
      src={src}
      alt=""
      draggable={false}
    />
  )
}

export function shouldSkipGreenhouseCarry(): boolean {
  return prefersReducedMotion()
}
