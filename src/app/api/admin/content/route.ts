import {revalidatePath} from 'next/cache';
import {requireOwner, requireSameOrigin, readJson, json, failure} from '@/lib/cms-auth';
import {readSnapshot, mutateContent} from '@/lib/cms-store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {try {await requireOwner(request); return json(readSnapshot());} catch (error) {return failure(error);}}
export async function POST(request: Request) {
  try {
    requireSameOrigin(request); await requireOwner(request);
    const snapshot = await mutateContent(await readJson(request));
    // Public readers use live storage, and this clears previously rendered route entries.
    revalidatePath('/', 'layout'); revalidatePath('/sitemap.xml');
    return json(snapshot);
  } catch (error) {return failure(error);}
}
