import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Locale,i18n} from '@/i18n/config';
import {getDictionary} from '@/i18n/get-dictionary';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/site/Footer';
import {headers} from 'next/headers';
import TerminalPeriodCleanup from '@/components/site/TerminalPeriodCleanup';
import '@/app/global.css';
import '@/app/balanced-theme.css';
import '@/app/corporate.css';
interface Props {children:React.ReactNode;params:Promise<{locale:string}>}
function validLocale(value:string):Locale {if(value!=='en'&&value!=='fa')notFound();return value;}
export function generateStaticParams(){return i18n.locales.map(locale=>({locale}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const locale=validLocale((await params).locale);const dict=await getDictionary(locale);return {title:dict.meta.title,description:dict.meta.description,icons:{icon:'/favicon.ico'},manifest:'/manifest.webmanifest',appleWebApp:{capable:true,title:'KRISM Sleep Hygiene',statusBarStyle:'black-translucent'}};}
export default async function RootLayout({children,params}:Props){const locale=validLocale((await params).locale);const host=((await headers()).get('host')||'').split(':')[0];const standaloneHost=host==='pwa.krism-society.com';return <html lang={locale} dir={locale==='fa'?'rtl':'ltr'} ><body><TerminalPeriodCleanup/>{standaloneHost?children:<><Navbar locale={locale}/><div className="app-content">{children}</div><Footer locale={locale}/></>}</body></html>;}
