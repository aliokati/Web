import {notFound} from 'next/navigation';
import {collections} from '@/lib/content';
import {CollectionPage} from '@/components/site/Content';
export default async function Section({params}:{params:Promise<{locale:string;section:string}>}){const {locale,section}=await params;if(!Object.hasOwn(collections,section))notFound();return <CollectionPage section={section} locale={locale}/>}
