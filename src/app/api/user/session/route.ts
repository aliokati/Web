import {NextResponse} from 'next/server';
import {clearUserSession,currentUser} from '@/lib/user-store';
export const runtime='nodejs';
export async function GET(request:Request){const user=await currentUser(request);return NextResponse.json(user?{authenticated:true,email:user.email}:{authenticated:false},{headers:{'Cache-Control':'no-store'}});}
export async function DELETE(){const response=NextResponse.json({ok:true});clearUserSession(response);return response;}
