import {CollectionPage} from '@/components/site/Content';
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <CollectionPage section="board" locale={locale}/>;}
