import ContactExperience from '@/components/site/ContactExperience';
import {contactDetails} from '@/content/contact-details';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return {title: locale === 'fa' ? 'تماس با KRISM — همکاری و ارتباط حرفه‌ای' : 'Contact KRISM — Partnerships & enquiries'};
}
export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return <ContactExperience locale={locale} details={contactDetails}/>;
}
