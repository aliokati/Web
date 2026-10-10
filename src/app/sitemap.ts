import type {MetadataRoute} from 'next';
import {collections,getRecords} from '@/lib/content';
export const dynamic = 'force-dynamic';
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL;if(!base)return [];const pages=['','public','about','professionals','research','research-board','events','network','resources','awareness','affiliations','standards','sleep-hygiene','sleep-hygiene/tools','sleep-check','contact'];return ['en','fa'].flatMap(locale=>[...pages.map(page=>({url:base+'/'+locale+(page?'/'+page:'')})),...Object.keys(collections).flatMap(section=>getRecords(section,locale).map(item=>({url:base+'/'+locale+'/'+section+'/'+item.slug})))]);}
