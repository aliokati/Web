import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KRISM Sleep Hygiene Portal',
    short_name: 'KRISM Sleep',
    description: 'Bilingual sleep hygiene tools, diary, assessments and learning resources.',
    start_url: '/en/sleep-hygiene',
    scope: '/',
    display: 'standalone',
    background_color: '#071c27',
    theme_color: '#0a2333',
    icons: [
      {src: '/images/krism-logo.png', sizes: '512x512', type: 'image/png'},
    ],
    shortcuts: [
      {name: 'Sleep hygiene', short_name: 'Sleep', url: '/en/sleep-hygiene'},
      {name: 'بهداشت خواب', short_name: 'خواب', url: '/fa/sleep-hygiene'},
    ],
  };
}
