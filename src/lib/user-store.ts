import fs from 'node:fs';
import path from 'node:path';
import {createHash, createHmac, randomBytes, randomUUID, timingSafeEqual} from 'node:crypto';
import {NextResponse} from 'next/server';
import {atomicWrite} from './cms-store';

const root = () => path.resolve(process.env.KRISM_USER_DATA_DIR || path.join(process.cwd(), 'data', 'users'));
const secretPath = () => path.join(root(), 'secret.key');
const tokenPath = () => path.join(root(), 'login-tokens.json');
const cookieName = 'krism_user';
const sessionSeconds = 30 * 24 * 60 * 60;
export interface WorkspaceData {schema: 1; updatedAt: string; checklist: boolean[]; plan: string; diary: Array<{date:string;bed:string;wake:string;quality:string;note:string}>}
interface UserFile {schema:1; id:string; email:string; version:number; createdAt:string; updatedAt:string; data:WorkspaceData|null; history:Array<{version:number;at:string;data:WorkspaceData|null}>}
interface LoginToken {hash:string;email:string;locale:'en'|'fa';expires:number}

async function secret() {
  await fs.promises.mkdir(root(), {recursive:true, mode:0o700});
  try {return (await fs.promises.readFile(secretPath(),'utf8')).trim();} catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    const value=randomBytes(48).toString('hex'); await fs.promises.writeFile(secretPath(),value,{mode:0o600,flag:'wx'}).catch(()=>{});
    return (await fs.promises.readFile(secretPath(),'utf8')).trim();
  }
}
const userPath=(id:string)=>path.join(root(),'records',id+'.json');
async function tokens():Promise<LoginToken[]>{try{return JSON.parse(await fs.promises.readFile(tokenPath(),'utf8')) as LoginToken[];}catch{return[];}}
export async function createLoginToken(email:string,locale:'en'|'fa'){
  const raw=randomBytes(32).toString('base64url'); const now=Date.now();
  const list=(await tokens()).filter(item=>item.expires>now&&item.email!==email);
  list.push({hash:createHash('sha256').update(raw).digest('hex'),email,locale,expires:now+15*60*1000});
  await atomicWrite(tokenPath(),list); return raw;
}
export async function consumeLoginToken(raw:string){
  if(!/^[A-Za-z0-9_-]{40,60}$/.test(raw))return null;
  const hash=createHash('sha256').update(raw).digest('hex'); const now=Date.now(); const list=await tokens();
  const found=list.find(item=>item.hash===hash&&item.expires>now)||null;
  await atomicWrite(tokenPath(),list.filter(item=>item.hash!==hash&&item.expires>now)); return found;
}
async function findOrCreate(email:string){
  const id=createHash('sha256').update((await secret())+'\0'+email).digest('hex').slice(0,32); const file=userPath(id);
  try{return JSON.parse(await fs.promises.readFile(file,'utf8')) as UserFile;}catch{
    const now=new Date().toISOString(); const user:UserFile={schema:1,id,email,version:0,createdAt:now,updatedAt:now,data:null,history:[]}; await atomicWrite(file,user); return user;
  }
}
export async function issueUserSession(response:NextResponse,email:string){
  const user=await findOrCreate(email); const payload=Buffer.from(JSON.stringify({id:user.id,email,expires:Date.now()+sessionSeconds*1000})).toString('base64url');
  const signature=createHmac('sha256',await secret()).update(payload).digest('base64url');
  response.cookies.set(cookieName,payload+'.'+signature,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:sessionSeconds});
}
export async function currentUser(request:Request):Promise<{id:string;email:string}|null>{
  const raw=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1); if(!raw)return null;
  const [payload,signature,extra]=raw.split('.'); if(!payload||!signature||extra)return null;
  const expected=createHmac('sha256',await secret()).update(payload).digest(); const actual=Buffer.from(signature,'base64url');
  if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;
  try{const claims=JSON.parse(Buffer.from(payload,'base64url').toString());return claims.expires>Date.now()&&typeof claims.id==='string'&&typeof claims.email==='string'?{id:claims.id,email:claims.email}:null;}catch{return null;}
}
export function clearUserSession(response:NextResponse){response.cookies.set(cookieName,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:0});}
export async function readUser(id:string){return JSON.parse(await fs.promises.readFile(userPath(id),'utf8')) as UserFile;}
export async function writeUser(id:string,expectedVersion:number,data:WorkspaceData){
  const user=await readUser(id); if(user.version!==expectedVersion)return null; const now=new Date().toISOString();
  user.history.unshift({version:user.version,at:now,data:user.data}); user.history=user.history.slice(0,20); user.version+=1; user.updatedAt=now; user.data={...data,updatedAt:now}; await atomicWrite(userPath(id),user); return user;
}
export async function deleteUser(id:string){await fs.promises.unlink(userPath(id)).catch(()=>{});}
export function validWorkspace(value:unknown):value is WorkspaceData{
  if(!value||typeof value!=='object'||Array.isArray(value))return false; const v=value as Record<string,unknown>;
  if(v.schema!==1||typeof v.plan!=='string'||v.plan.length>5000||!Array.isArray(v.checklist)||v.checklist.length>20||!v.checklist.every(x=>typeof x==='boolean')||!Array.isArray(v.diary)||v.diary.length>31)return false;
  return v.diary.every(row=>row&&typeof row==='object'&&['date','bed','wake','quality','note'].every(key=>typeof (row as Record<string,unknown>)[key]==='string'&&String((row as Record<string,unknown>)[key]).length<=500));
}
