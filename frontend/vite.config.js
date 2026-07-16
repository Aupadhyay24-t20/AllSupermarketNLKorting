import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Fresco – Supermarkt Aanbiedingen',
        short_name: 'Fresco',
        description: 'Alle supermarkt aanbiedingen van Albert Heijn en Jumbo op één plek. Wekelijks bijgewerkt, altijd gratis.',
        theme_color: '#1e6b3c',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        lang: 'nl',
        icons: [
          { src: 'pwa-64x64.png',            sizes: '64x64',   type: 'image/png' },
          { src: 'pwa-192x192.png',           sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png',           sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/deals'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-deals',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
})
