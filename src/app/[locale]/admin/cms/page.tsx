import type {Metadata} from 'next';
import ContentManager from '@/components/cms/ContentManager';
import '@/app/cms.css';
export const metadata: Metadata = {title:'Content manager — KRISM',robots:{index:false,follow:false}};
export const dynamic = 'force-dynamic';
export default async function AdminCmsPage({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  return <ContentManager locale={locale}/>;
}
