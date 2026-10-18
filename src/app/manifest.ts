import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'KRISM Sleep Medicine',
    short_name: 'KRISM',
    description: 'KRISM Society for sleep medicine, learning and practical resources',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#071c27',
    theme_color: '#0a2333',
    icons: [
      {src: '/images/krism-logo.png', sizes: '1086x1086', type: 'image/png', purpose: 'any'},
    ],
    shortcuts: [
      {name: 'Sleep hygiene', short_name: 'Sleep', url: '/en/sleep-hygiene'},
      {name: 'بهداشت خواب', short_name: 'خواب', url: '/fa/sleep-hygiene'},
    ],
  };
}
