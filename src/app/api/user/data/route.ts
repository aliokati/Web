import {NextResponse} from 'next/server';
import {currentUser,deleteUser,readUser,validWorkspace,writeUser} from '@/lib/user-store';
import {requireSameOrigin} from '@/lib/cms-auth';
export const runtime='nodejs';
const out=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
export async function GET(request:Request){const auth=await currentUser(request);if(!auth)return out({error:'unauthorized'},401);const user=await readUser(auth.id);return out({version:user.version,updatedAt:user.updatedAt,data:user.data});}
export async function PUT(request:Request){try{requireSameOrigin(request);const auth=await currentUser(request);if(!auth)return out({error:'unauthorized'},401);if(Number(request.headers.get('content-length'))>256000)return out({error:'too_large'},413);const body=await request.json() as {version?:unknown;data?:unknown};if(!Number.isSafeInteger(body.version)||!validWorkspace(body.data))return out({error:'invalid_data'},400);const user=await writeUser(auth.id,body.version as number,body.data);return user?out({version:user.version,updatedAt:user.updatedAt}):out({error:'conflict'},409);}catch{return out({error:'save_failed'},400);}}
export async function DELETE(request:Request){try{requireSameOrigin(request);const auth=await currentUser(request);if(!auth)return out({error:'unauthorized'},401);await deleteUser(auth.id);return out({ok:true});}catch{return out({error:'delete_failed'},400);}}
