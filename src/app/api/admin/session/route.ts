import {readOwner, authenticated, setupAllowed, requireSameOrigin, readJson, createOwner, checkPassword, issueSession, clearSession, allowLogin, json, failure, requireOwner, changePassword} from '@/lib/cms-auth';
import {CmsError} from '@/lib/cms-validation';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {try {const owner = await readOwner(); return json({authenticated: await authenticated(request), configured: Boolean(owner), setupAllowed: !owner && setupAllowed(request)});} catch (error) {return failure(error);}}
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const body = await readJson(request, 4096);
    allowLogin();
    let owner = await readOwner();
    if (body.action === 'setup') {
      if (!setupAllowed(request)) throw new CmsError('setup_local_only', 403);
      if (typeof body.password !== 'string') throw new CmsError('password_length');
      owner = await createOwner(body.password);
    } else {
      if (!owner || !await checkPassword(owner, body.password)) throw new CmsError('wrong_password', 401);
    }
    const response = json({ok: true}); issueSession(response, owner!); return response;
  } catch (error) {return failure(error);}
}
export async function DELETE(request: Request) {try {requireSameOrigin(request); await requireOwner(request); const response = json({ok: true}); clearSession(response); return response;} catch (error) {return failure(error);}}
export async function PUT(request: Request) {
  try {requireSameOrigin(request);await requireOwner(request);allowLogin();const body=await readJson(request,4096);const owner=await changePassword(body.currentPassword,body.password);const response=json({ok:true});issueSession(response,owner);return response;} catch(error){return failure(error);}
}
