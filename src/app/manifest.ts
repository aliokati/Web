import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VELA Recovery Workspace · KRISM',
    short_name: 'VELA Recovery',
    description: 'A private, installable recovery workspace with local-first data controls.',
    start_url: '/en/sleep-hygiene/app',
    scope: '/',
    display: 'standalone',
    background_color: '#071c27',
    theme_color: '#0a2333',
    icons: [
      {src: '/images/krism-logo.png', sizes: '512x512', type: 'image/png'},
    ],
    shortcuts: [
      {name: 'VELA workspace', short_name: 'VELA', url: '/en/sleep-hygiene/app'},
      {name: 'فضای ولا', short_name: 'ولا', url: '/fa/sleep-hygiene/app'},
    ],
  };
}
