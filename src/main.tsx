import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { captureInstallPrompt } from './components/InstallApp'
import './index.css'
import App from './App.tsx'

captureInstallPrompt()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
