import {redirect} from 'next/navigation';
import type {Locale} from '@/i18n/config';

export default async function GapsRoute({params}:{params:Promise<{locale:Locale}>}){const {locale}=await params;redirect(`/${locale}/sleep-check/tracks`);}
