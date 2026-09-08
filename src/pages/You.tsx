import './You.css'

export function You() {
  return (
    <section className="page you">
      <header className="page__header">
        <p className="eyebrow">You</p>
        <h1>Your space</h1>
        <p className="lede">
          Ad-free by design. No account, no payments — just local hobbies on this device for now.
        </p>
      </header>

      <div className="you-card">
        <h2>About FlutterHobby</h2>
        <p>
          A cozy hobby tracker with a greenhouse-first feel. Grow what you love at your own
          pace. Domain: <strong>flutterhobby.fun</strong>
        </p>
      </div>

      <div className="you-card">
        <h2>Privacy</h2>
        <p>
          Progress is stored in your browser&apos;s localStorage. Nothing is sent to a server
          yet. Clearing site data will reset your greenhouse.
        </p>
      </div>

      <div className="you-card you-card--note">
        <h2>Coming later</h2>
        <ul>
          <li>Optional sync / account (still ad-free)</li>
          <li>Theme unlocks &amp; buddy art</li>
          <li>Export / backup</li>
        </ul>
      </div>
    </section>
  )
}
