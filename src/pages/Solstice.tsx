import './Solstice.css'

export function Solstice() {
  return (
    <section className="page solstice">
      <header className="page__header">
        <p className="eyebrow">Solstice</p>
        <h1>Seasonal rhythm</h1>
        <p className="lede">
          A soft place for seasonal check-ins, rest days, and celebrating what you finished.
          Placeholder for now — no calendar hooks yet.
        </p>
      </header>

      <div className="solstice-card">
        <h2>This season</h2>
        <p>
          FlutterHobby will gently notice when hobbies go quiet or bloom again. For now, tend
          them from Home and mark proud shelf wins when you are ready.
        </p>
      </div>

      <div className="solstice-card solstice-card--muted">
        <h2>Coming later</h2>
        <ul>
          <li>Seasonal prompts (no guilt streaks)</li>
          <li>Resting → In season soft restarts</li>
          <li>Proud shelf showcase</li>
        </ul>
      </div>
    </section>
  )
}
