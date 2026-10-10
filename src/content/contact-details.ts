export interface ContactDetails {
  email: string;
  phone: string;
  address: {en: string; fa: string};
  hours: {en: string; fa: string};
  socialLinks: {label: string; url: string}[];
  delivery: 'smtp';
}

// Publish only confirmed organizational details.
export const contactDetails: ContactDetails = {
  email: 'info@krism-society.com',
  phone: '',
  address: {en: 'Mashhad, Kohsangi Street 8, after the first intersection, Platinum 1 Building, Floor 4, Unit 13', fa: 'مشهد، خیابان کوهسنگی ۸، بعد از چهارراه اول، ساختمان پلاتینیوم ۱، طبقه ۴، واحد ۱۳'},
  hours: {en: '', fa: ''},
  socialLinks: [
    {label: 'LinkedIn', url: 'https://www.linkedin.com/in/krism-society-4916413b2/'},
    {label: 'Telegram', url: 'https://t.me/KRISM_Society'},
  ],
  delivery: 'smtp',
};
