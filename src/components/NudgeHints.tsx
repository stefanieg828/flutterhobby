import type { Hobby } from '../types'
import { isNudgeDue, nudgeHintCopy } from '../types'
import {
  dismissNudge,
  isNudgeDismissed,
  loadDismissedNudges,
} from '../storage'
import { useMemo, useState } from 'react'
import './NudgeHints.css'

interface NudgeHintsProps {
  hobbies: Hobby[]
  onOpenHobby?: (id: string) => void
  /** Soft heading for the card. */
  title?: string
}

export function NudgeHints({
  hobbies,
  onOpenHobby,
  title = 'Gentle nudges',
}: NudgeHintsProps) {
  const [dismissed, setDismissed] = useState(() => loadDismissedNudges())

  const due = useMemo(() => {
    return hobbies.filter(
      (h) =>
        isNudgeDue(h) &&
        !isNudgeDismissed(h.id, h.nextNudgeAt, dismissed),
    )
  }, [hobbies, dismissed])

  if (due.length === 0) return null

  function handleDismiss(hobby: Hobby) {
    if (!hobby.nextNudgeAt) return
    dismissNudge(hobby.id, hobby.nextNudgeAt)
    setDismissed(loadDismissedNudges())
  }

  return (
    <aside className="nudge-hints" aria-label={title}>
      <p className="nudge-hints__eyebrow">{title}</p>
      <ul className="nudge-hints__list">
        {due.map((hobby) => (
          <li key={hobby.id} className="nudge-hints__card">
            <p className="nudge-hints__copy">{nudgeHintCopy(hobby)}</p>
            <div className="nudge-hints__actions">
              {onOpenHobby ? (
                <button
                  type="button"
                  className="nudge-hints__open"
                  onClick={() => onOpenHobby(hobby.id)}
                >
                  Open
                </button>
              ) : null}
              <button
                type="button"
                className="nudge-hints__dismiss"
                onClick={() => handleDismiss(hobby)}
              >
                Not now
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
