import { useCallback, useEffect, useState } from 'react'
import './InstallApp.css'

const ROTATE_TIP_KEY = 'fh-rotate-tip-dismissed'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const mq = window.matchMedia('(display-mode: standalone)').matches
  const ios = 'standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true
  return mq || ios
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const webkit = /WebKit/.test(ua)
  const notOther = !/CriOS|FxiOS|EdgiOS|OPiOS|mercury/.test(ua)
  return iOS && webkit && notOther
}

let deferredPromptGlobal: BeforeInstallPromptEvent | null = null

/** Capture beforeinstallprompt as early as possible (call from main). */
export function captureInstallPrompt() {
  if (typeof window === 'undefined') return
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPromptGlobal = e as BeforeInstallPromptEvent
    window.dispatchEvent(new CustomEvent('fh-install-available'))
  })
  window.addEventListener('appinstalled', () => {
    deferredPromptGlobal = null
    window.dispatchEvent(new CustomEvent('fh-app-installed'))
  })
}

type InstallAppButtonProps = {
  variant?: 'card' | 'chip' | 'banner'
}

export function InstallAppButton({ variant = 'card' }: InstallAppButtonProps) {
  const [installed, setInstalled] = useState(isStandalone)
  const [canPrompt, setCanPrompt] = useState(() => deferredPromptGlobal != null)
  const [showIosSheet, setShowIosSheet] = useState(false)
  const ios = isIosSafari()

  useEffect(() => {
    const sync = () => {
      setInstalled(isStandalone())
      setCanPrompt(deferredPromptGlobal != null)
    }
    sync()
    window.addEventListener('fh-install-available', sync)
    window.addEventListener('fh-app-installed', sync)
    const mq = window.matchMedia('(display-mode: standalone)')
    mq.addEventListener?.('change', sync)
    return () => {
      window.removeEventListener('fh-install-available', sync)
      window.removeEventListener('fh-app-installed', sync)
      mq.removeEventListener?.('change', sync)
    }
  }, [])

  const onInstall = useCallback(async () => {
    if (installed) return
    if (deferredPromptGlobal) {
      await deferredPromptGlobal.prompt()
      const choice = await deferredPromptGlobal.userChoice
      if (choice.outcome === 'accepted') {
        deferredPromptGlobal = null
        setCanPrompt(false)
        setInstalled(true)
      }
      return
    }
    if (ios) {
      setShowIosSheet(true)
      return
    }
    // Chromium without prompt yet / other browsers — gentle fallback tip
    setShowIosSheet(true)
  }, [installed, ios])

  if (variant === 'chip' && installed) {
    return (
      <span className="install-chip install-chip--done" aria-label="App installed">
        Installed ♡
      </span>
    )
  }

  if (variant === 'banner' && installed) return null

  const label = installed ? 'Installed ♡' : variant === 'chip' ? 'Add to Home' : 'Install FlutterHobby'

  return (
    <>
      {variant === 'card' && (
        <div className="you-card install-card">
          <h2>Add to Home</h2>
          <p className="install-card__lede">
            {installed
              ? 'You already have FlutterHobby on your home screen — cozy.'
              : 'Put the greenhouse on your home screen so it opens like an app (best in landscape).'}
          </p>
          <button
            type="button"
            className={`install-btn${installed ? ' install-btn--done' : ''}`}
            onClick={onInstall}
            disabled={installed}
            aria-disabled={installed}
          >
            {label}
          </button>
          {!installed && !canPrompt && !ios && (
            <p className="install-card__hint">
              If your browser supports it, the install prompt will appear when you tap. On iPhone, use Share → Add
              to Home Screen.
            </p>
          )}
        </div>
      )}

      {variant === 'chip' && !installed && (
        <button type="button" className="install-chip" onClick={onInstall}>
          Add to Home
        </button>
      )}

      {variant === 'banner' && !installed && (
        <div className="install-banner" role="region" aria-label="Install app">
          <span className="install-banner__text">Run FlutterHobby like an app ♡</span>
          <button type="button" className="install-banner__btn" onClick={onInstall}>
            Add to Home
          </button>
        </div>
      )}

      {showIosSheet && (
        <div
          className="install-sheet-backdrop"
          role="presentation"
          onClick={() => setShowIosSheet(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowIosSheet(false)}
        >
          <div
            className="install-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-sheet-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="install-sheet-title">{ios ? 'Add to Home Screen' : 'Install tip'}</h2>
            {ios ? (
              <ol className="install-sheet__steps">
                <li>
                  Tap the <strong>Share</strong> button in Safari (square with an arrow)
                </li>
                <li>
                  Scroll and tap <strong>Add to Home Screen</strong>
                </li>
                <li>
                  Tap <strong>Add</strong> — then open FlutterHobby from your home screen
                </li>
              </ol>
            ) : (
              <p>
                Use your browser&apos;s menu to <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                On iPhone Safari: Share → Add to Home Screen.
              </p>
            )}
            <p className="install-sheet__note">Tip: rotate to landscape for the full greenhouse ♡</p>
            <button type="button" className="install-btn" onClick={() => setShowIosSheet(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/** Portrait tip: gentle, dismissible, remembered in localStorage. */
export function RotateTip() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(ROTATE_TIP_KEY) === '1') return

    const mq = window.matchMedia('(orientation: portrait) and (max-width: 900px)')
    const update = () => setShow(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  if (!show) return null

  return (
    <div className="rotate-tip" role="status">
      <p className="rotate-tip__text">Rotate for the full greenhouse ♡</p>
      <button
        type="button"
        className="rotate-tip__dismiss"
        aria-label="Dismiss rotate tip"
        onClick={() => {
          localStorage.setItem(ROTATE_TIP_KEY, '1')
          setShow(false)
        }}
      >
        ✕
      </button>
    </div>
  )
}
