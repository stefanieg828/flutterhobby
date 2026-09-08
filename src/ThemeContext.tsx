import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  THEME_COPY,
  loadTheme,
  saveTheme,
  type PlayableTheme,
  type ThemeCopy,
} from './theme'

interface ThemeContextValue {
  theme: PlayableTheme
  copy: ThemeCopy
  setTheme: (theme: PlayableTheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<PlayableTheme>(() => loadTheme())

  const setTheme = useCallback((next: PlayableTheme) => {
    setThemeState(next)
    saveTheme(next)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      copy: THEME_COPY[theme],
      setTheme,
    }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
