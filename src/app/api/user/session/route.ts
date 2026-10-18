import {NextResponse} from 'next/server';
import {clearUserSession,currentUser,memberDisplayName} from '@/lib/user-store';
import {requireSameOrigin} from '@/lib/cms-auth';
export const runtime='nodejs';
export async function GET(request:Request){const user=await currentUser(request);return NextResponse.json(user?{authenticated:true,email:user.email,name:memberDisplayName(user.email)}:{authenticated:false},{headers:{'Cache-Control':'no-store'}});}
export async function DELETE(request:Request){try{requireSameOrigin(request);const response=NextResponse.json({ok:true});clearUserSession(response);return response;}catch{return NextResponse.json({error:'forbidden'},{status:403});}}
