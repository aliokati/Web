import fs from 'node:fs/promises';
import path from 'node:path';
import {dataDirectory} from '@/lib/cms-store';
export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{name:string}>}) {
  const {name}=await params;
  if(!/^[a-f0-9-]{36}\.webp$/.test(name))return new Response('Not found',{status:404});
  try {const image=await fs.readFile(path.join(dataDirectory(),'assets',name));return new Response(new Uint8Array(image),{headers:{'Content-Type':'image/webp','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable'}});} catch {return new Response('Not found',{status:404});}
}
