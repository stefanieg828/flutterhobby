import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { RotateTip } from './components/InstallApp'
import { Home } from './pages/Home'
import { Collections } from './pages/Collections'
import { Solstice } from './pages/Solstice'
import { You } from './pages/You'
import { ThemeProvider } from './ThemeContext'
import './App.css'

// Vite BASE_URL has a trailing slash; React Router basename should not.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={basename === '/' ? undefined : basename}>
        <div className="app-shell">
          <RotateTip />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/solstice" element={<Solstice />} />
              <Route path="/you" element={<You />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
