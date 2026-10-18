import fs from 'node:fs';
import path from 'node:path';
import {createHash, createHmac, randomBytes, randomInt, timingSafeEqual} from 'node:crypto';
import {NextResponse} from 'next/server';
import {atomicWrite} from './cms-store';

const root = () => path.resolve(process.env.KRISM_USER_DATA_DIR || path.join(process.cwd(), 'data', 'users'));
const secretPath = () => path.join(root(), 'secret.key');
const tokenPath = () => path.join(root(), 'login-tokens.json');
const codePath = () => path.join(root(), 'login-codes.json');
const cookieName = 'krism_user';
const sessionSeconds = 30 * 24 * 60 * 60;
export const MEMBER_EMAIL_DOMAIN = 'krism-society.com';
export function isMemberEmail(email:string){return /^[^\s@<>;,]+@krism-society\.com$/i.test(email.trim());}
export function memberDisplayName(email:string){const local=email.split('@')[0]||'';return local.split(/[._-]+/).filter(Boolean).map(part=>part.slice(0,1).toUpperCase()+part.slice(1)).join(' ')||'Member';}
export interface SleepCompanionCheckin {date:string;bedtime:string;wake:string;quality:number;focus:string}
export interface SleepCompanionData {schema:1;updatedAt:string;focus:string;plan:string;habits:boolean[];completedLessons:string[];checkins:SleepCompanionCheckin[]}
export interface WorkspaceData {schema: 1; updatedAt: string; checklist: boolean[]; plan: string; diary: Array<{date:string;bed:string;wake:string;quality:string;note:string}>; app?:SleepCompanionData}
interface UserFile {schema:1; id:string; email:string; version:number; createdAt:string; updatedAt:string; data:WorkspaceData|null; history:Array<{version:number;at:string;data:WorkspaceData|null}>}
interface LoginToken {hash:string;email:string;locale:'en'|'fa';expires:number}
interface LoginCode {hash:string;email:string;locale:'en'|'fa';expires:number;attempts:number}

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
async function codes():Promise<LoginCode[]>{try{return JSON.parse(await fs.promises.readFile(codePath(),'utf8')) as LoginCode[];}catch{return[];}}

export async function createLoginCode(email:string,locale:'en'|'fa'){
  if(!isMemberEmail(email)) throw new Error('member_email_required');
  const raw=String(randomInt(100000,1000000)); const now=Date.now();
  const list=(await codes()).filter(item=>item.expires>now&&item.email!==email);
  list.push({hash:createHash('sha256').update(raw).digest('hex'),email,locale,expires:now+10*60*1000,attempts:0});
  await atomicWrite(codePath(),list); return raw;
}
export async function consumeLoginCode(email:string,raw:string){
  const normalized=raw.trim(); if(!isMemberEmail(email)||!/^[0-9]{6}$/.test(normalized))return {ok:false as const,reason:'invalid_code'};
  const now=Date.now(); const list=await codes(); const index=list.findIndex(item=>item.email===email&&item.expires>now);
  if(index<0){await atomicWrite(codePath(),list.filter(item=>item.expires>now));return {ok:false as const,reason:'code_expired'};}
  const challenge=list[index];
  if(challenge.attempts>=5){list.splice(index,1);await atomicWrite(codePath(),list);return {ok:false as const,reason:'too_many_attempts'};}
  challenge.attempts+=1;
  const expected=Buffer.from(challenge.hash,'hex'); const actual=createHash('sha256').update(normalized).digest();
  if(expected.length!==actual.length||!timingSafeEqual(expected,actual)){await atomicWrite(codePath(),list.filter(item=>item.expires>now));return {ok:false as const,reason:'invalid_code'};}
  list.splice(index,1); await atomicWrite(codePath(),list.filter(item=>item.expires>now)); return {ok:true as const,email:challenge.email,locale:challenge.locale};
}
export async function createLoginToken(email:string,locale:'en'|'fa'){
  if(!isMemberEmail(email)) throw new Error('member_email_required');
  const raw=randomBytes(32).toString('base64url'); const now=Date.now();
  const list=(await tokens()).filter(item=>item.expires>now&&item.email!==email);
  list.push({hash:createHash('sha256').update(raw).digest('hex'),email,locale,expires:now+15*60*1000});
  await atomicWrite(tokenPath(),list); return raw;
}
export async function consumeLoginToken(raw:string){
  if(!/^[A-Za-z0-9_-]{40,60}$/.test(raw))return null;
  const hash=createHash('sha256').update(raw).digest('hex'); const now=Date.now(); const list=await tokens();
  const found=list.find(item=>item.hash===hash&&item.expires>now&&isMemberEmail(item.email))||null;
  await atomicWrite(tokenPath(),list.filter(item=>item.hash!==hash&&item.expires>now)); return found;
}
async function findOrCreate(email:string){
  const id=createHash('sha256').update((await secret())+'\0'+email).digest('hex').slice(0,32); const file=userPath(id);
  try{return JSON.parse(await fs.promises.readFile(file,'utf8')) as UserFile;}catch{
    const now=new Date().toISOString(); const user:UserFile={schema:1,id,email,version:0,createdAt:now,updatedAt:now,data:null,history:[]}; await atomicWrite(file,user); return user;
  }
}
export async function issueUserSession(response:NextResponse,email:string){
  if(!isMemberEmail(email)) throw new Error('member_email_required');
  const user=await findOrCreate(email); const payload=Buffer.from(JSON.stringify({id:user.id,email,expires:Date.now()+sessionSeconds*1000})).toString('base64url');
  const signature=createHmac('sha256',await secret()).update(payload).digest('base64url');
  const domain=process.env.NODE_ENV==='production'&&process.env.KRISM_USER_COOKIE_DOMAIN?process.env.KRISM_USER_COOKIE_DOMAIN:undefined;
  response.cookies.set(cookieName,payload+'.'+signature,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',domain,maxAge:sessionSeconds});
}
export async function currentUser(request:Request):Promise<{id:string;email:string}|null>{
  const raw=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1); if(!raw)return null;
  const [payload,signature,extra]=raw.split('.'); if(!payload||!signature||extra)return null;
  const expected=createHmac('sha256',await secret()).update(payload).digest(); const actual=Buffer.from(signature,'base64url');
  if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;
  try{const claims=JSON.parse(Buffer.from(payload,'base64url').toString());return claims.expires>Date.now()&&typeof claims.id==='string'&&typeof claims.email==='string'&&isMemberEmail(claims.email)?{id:claims.id,email:claims.email}:null;}catch{return null;}
}
export function clearUserSession(response:NextResponse){const domain=process.env.NODE_ENV==='production'&&process.env.KRISM_USER_COOKIE_DOMAIN?process.env.KRISM_USER_COOKIE_DOMAIN:undefined;response.cookies.set(cookieName,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',domain,maxAge:0});}
export async function readUser(id:string){return JSON.parse(await fs.promises.readFile(userPath(id),'utf8')) as UserFile;}
export async function writeUser(id:string,expectedVersion:number,data:WorkspaceData){
  const user=await readUser(id); if(user.version!==expectedVersion)return null; const now=new Date().toISOString();
  user.history.unshift({version:user.version,at:now,data:user.data}); user.history=user.history.slice(0,20); user.version+=1; user.updatedAt=now; user.data={...data,updatedAt:now}; await atomicWrite(userPath(id),user); return user;
}
export async function deleteUser(id:string){await fs.promises.unlink(userPath(id)).catch(()=>{});}
export function validWorkspace(value:unknown):value is WorkspaceData{
  if(!value||typeof value!=='object'||Array.isArray(value))return false; const v=value as Record<string,unknown>;
  if(v.schema!==1||typeof v.plan!=='string'||v.plan.length>5000||!Array.isArray(v.checklist)||v.checklist.length>20||!v.checklist.every(x=>typeof x==='boolean')||!Array.isArray(v.diary)||v.diary.length>31)return false;
  if(!v.diary.every(row=>row&&typeof row==='object'&&['date','bed','wake','quality','note'].every(key=>typeof (row as Record<string,unknown>)[key]==='string'&&String((row as Record<string,unknown>)[key]).length<=500)))return false;
  if(v.app===undefined)return true;
  if(!v.app||typeof v.app!=='object'||Array.isArray(v.app))return false;
  const app=v.app as Record<string,unknown>;
  if(app.schema!==1||typeof app.updatedAt!=='string'||app.updatedAt.length>80||typeof app.focus!=='string'||app.focus.length>80||typeof app.plan!=='string'||app.plan.length>5000||!Array.isArray(app.habits)||app.habits.length>12||!app.habits.every(item=>typeof item==='boolean')||!Array.isArray(app.completedLessons)||app.completedLessons.length>60||!app.completedLessons.every(item=>typeof item==='string'&&item.length<=100)||!Array.isArray(app.checkins)||app.checkins.length>120)return false;
  return app.checkins.every(item=>item&&typeof item==='object'&&!Array.isArray(item)&&typeof (item as Record<string,unknown>).date==='string'&&String((item as Record<string,unknown>).date).length<=32&&typeof (item as Record<string,unknown>).bedtime==='string'&&String((item as Record<string,unknown>).bedtime).length<=16&&typeof (item as Record<string,unknown>).wake==='string'&&String((item as Record<string,unknown>).wake).length<=16&&Number.isInteger((item as Record<string,unknown>).quality)&&Number((item as Record<string,unknown>).quality)>=1&&Number((item as Record<string,unknown>).quality)<=5&&typeof (item as Record<string,unknown>).focus==='string'&&String((item as Record<string,unknown>).focus).length<=80);
}
