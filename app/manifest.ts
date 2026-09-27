import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '脳内オカマバー',
    short_name: '脳内オカマバー',
    description: '悩んだら、ママに聞きなさい。',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a100d',
    theme_color: '#1a100d',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
