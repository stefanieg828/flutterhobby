import { useCallback, useEffect, useState } from 'react'
import type { Hobby } from '../types'
import { loadHobbies, saveHobbies } from '../storage'
import { HobbyCard } from '../components/HobbyCard'
import { CreateHobbyForm } from '../components/CreateHobbyForm'
import './Home.css'

const SEED: Hobby[] = [
  {
    id: 'seed-watercolor',
    name: 'Watercolor mornings',
    creating: 'Soft landscapes in gouache',
    cadence: 'every-few-days',
    petName: 'Fern',
    status: 'in-season',
    progress: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-knitting',
    name: 'Cozy knit scarf',
    creating: 'Learning brioche stitch',
    cadence: 'weekly',
    status: 'resting',
    progress: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-zine',
    name: 'Mini zine shelf',
    creating: 'Printed edition of doodle comics',
    cadence: 'when-inspired',
    petName: 'Ink',
    status: 'proud-shelf',
    progress: 12,
    createdAt: new Date().toISOString(),
  },
]

export function Home() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = loadHobbies()
    if (stored.length === 0) {
      saveHobbies(SEED)
      setHobbies(SEED)
    } else {
      setHobbies(stored)
    }
    setReady(true)
  }, [])

  const persist = useCallback((next: Hobby[]) => {
    setHobbies(next)
    saveHobbies(next)
  }, [])

  function handleCreate(hobby: Hobby) {
    persist([hobby, ...hobbies])
  }

  function handleTend(id: string) {
    persist(
      hobbies.map((h) =>
        h.id === id
          ? {
              ...h,
              progress: h.progress + 1,
              lastTendedAt: new Date().toISOString(),
              status: h.status === 'resting' ? 'in-season' : h.status,
            }
          : h,
      ),
    )
  }

  return (
    <section className="page home">
      <header className="page__header">
        <p className="eyebrow">Greenhouse</p>
        <h1>Your hobbies</h1>
        <p className="lede">
          Tend what you love. No streaks to break — just gentle progress, saved on this device.
        </p>
      </header>

      <CreateHobbyForm onCreate={handleCreate} />

      <div className="hobby-list">
        {!ready ? (
          <p className="muted">Loading your greenhouse…</p>
        ) : hobbies.length === 0 ? (
          <p className="muted">Nothing planted yet. Add your first hobby above.</p>
        ) : (
          hobbies.map((hobby) => (
            <HobbyCard key={hobby.id} hobby={hobby} onTend={handleTend} />
          ))
        )}
      </div>
    </section>
  )
}
