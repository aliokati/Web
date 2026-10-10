import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import sharp from 'sharp';
import {requireOwner, requireSameOrigin, readBytes, json, failure} from '@/lib/cms-auth';
import {dataDirectory} from '@/lib/cms-store';
import {CmsError} from '@/lib/cms-validation';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    await requireOwner(request);
    const root = path.join(process.cwd(), 'public', 'images');
    const images: string[] = [];
    async function walk(directory: string, depth = 0) {
      if (depth > 4 || images.length >= 500) return;
      for (const item of await fs.readdir(directory, {withFileTypes: true})) {
        if (item.isSymbolicLink()) continue;
        const target = path.join(directory, item.name);
        if (item.isDirectory()) await walk(target, depth + 1);
        else if (/\.(?:png|jpe?g|webp|gif)$/i.test(item.name)) images.push('/images/' + path.relative(root, target).split(path.sep).join('/'));
      }
    }
    await walk(root);
    try {for(const name of await fs.readdir(path.join(dataDirectory(),'assets'))) if(/^[a-f0-9-]{36}\.webp$/.test(name))images.push('/api/media/'+name);} catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
    return json({images});
  } catch (error) {return failure(error);}
}
export async function POST(request:Request) {
  try {
    requireSameOrigin(request); await requireOwner(request);
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) throw new CmsError('invalid_image');
    const bytes=await readBytes(request,6*1024*1024);
    const form=await new Response(new Uint8Array(bytes),{headers:{'Content-Type':request.headers.get('content-type')!}}).formData();
    const image=form.get('image');
    if (!(image instanceof File) || image.size>5*1024*1024 || !['image/jpeg','image/png','image/webp'].includes(image.type)) throw new CmsError('invalid_image');
    let optimized:Buffer;
    try {
      const input=Buffer.from(await image.arrayBuffer());
      const metadata=await sharp(input,{limitInputPixels:25000000}).metadata();
      if(!['jpeg','png','webp'].includes(metadata.format||''))throw new Error();
      optimized=await sharp(input,{limitInputPixels:25000000}).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer();
    } catch {throw new CmsError('invalid_image');}
    const name=randomUUID()+'.webp';const folder=path.join(dataDirectory(),'assets');
    await fs.mkdir(folder,{recursive:true,mode:0o700});await fs.writeFile(path.join(folder,name),optimized,{flag:'wx',mode:0o600});
    return json({url:'/api/media/'+name},201);
  } catch(error){return failure(error);}
}
