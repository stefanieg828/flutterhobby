import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages project site needs /flutterhobby/; local dev/build keep /
const base =
  process.env.VITE_BASE ||
  (process.env.GITHUB_ACTIONS === "true" ? "/flutterhobby/" : "/")

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'FlutterHobby',
        short_name: 'FlutterHobby',
        description: 'A cozy, ad-free hobby tracker — grow what you love, one gentle nudge at a time.',
        theme_color: '#2d6a4f',
        background_color: '#f1faee',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
})
