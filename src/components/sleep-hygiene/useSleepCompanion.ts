'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';

export type SleepFocus='routine'|'timing'|'room'|'learn';
export type SleepCheckin={date:string;bedtime:string;wake:string;quality:number;focus:SleepFocus};
export type SleepCompanionData={schema:1;updatedAt:string;focus:SleepFocus;plan:string;habits:boolean[];completedLessons:string[];checkins:SleepCheckin[]};
export type SyncStatus='idle'|'syncing'|'saved'|'restored'|'error';

const key='krism-sleep-companion-v2';
const focusValues:SleepFocus[]=['routine','timing','room','learn'];
const defaultData=():SleepCompanionData=>({schema:1,updatedAt:new Date().toISOString(),focus:'routine',plan:'',habits:Array(5).fill(false),completedLessons:[],checkins:[]});
const localDay=()=>new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());

function validTime(value:unknown):value is string{return typeof value==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(value);}
function normalise(value:unknown):SleepCompanionData{
  if(!value||typeof value!=='object'||Array.isArray(value))return defaultData();
  const source=value as Record<string,unknown>;
  const checkins=Array.isArray(source.checkins)?source.checkins.flatMap(item=>{
    if(!item||typeof item!=='object'||Array.isArray(item))return [];
    const row=item as Record<string,unknown>;
    const focus=focusValues.includes(row.focus as SleepFocus)?row.focus as SleepFocus:'routine';
    return typeof row.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(row.date)&&validTime(row.bedtime)&&validTime(row.wake)&&Number.isInteger(row.quality)&&Number(row.quality)>=1&&Number(row.quality)<=5?[{date:row.date,bedtime:row.bedtime,wake:row.wake,quality:Number(row.quality),focus}]:[];
  }).slice(-120):[];
  return {
    schema:1,
    updatedAt:typeof source.updatedAt==='string'&&Number.isFinite(Date.parse(source.updatedAt))?source.updatedAt:new Date().toISOString(),
    focus:focusValues.includes(source.focus as SleepFocus)?source.focus as SleepFocus:'routine',
    plan:typeof source.plan==='string'?source.plan.slice(0,5000):'',
    habits:Array.from({length:5},(_,index)=>Array.isArray(source.habits)&&source.habits[index]===true),
    completedLessons:Array.isArray(source.completedLessons)?source.completedLessons.filter((item):item is string=>typeof item==='string'&&item.length<=100).slice(0,60):[],
    checkins,
  };
}

function legacyData():SleepCompanionData{
  try{
    const legacy=JSON.parse(localStorage.getItem('krism-sleep-workspace-v1')||'null') as Record<string,unknown>|null;
    if(!legacy)return defaultData();
    const diary=Array.isArray(legacy.diary)?legacy.diary:[];
    const checkins=diary.flatMap(item=>{
      if(!item||typeof item!=='object'||Array.isArray(item))return [];
      const row=item as Record<string,unknown>;
      return typeof row.date==='string'&&validTime(row.bed)&&validTime(row.wake)?[{date:row.date,bedtime:row.bed,wake:row.wake,quality:Math.min(5,Math.max(1,Number(row.quality)||3)),focus:'routine' as SleepFocus}]:[];
    });
    return normalise({updatedAt:legacy.updatedAt,focus:'routine',plan:legacy.plan,habits:legacy.checklist,checkins});
  }catch{return defaultData();}
}

export function sleepDurationMinutes(bedtime:string,wake:string){
  if(!validTime(bedtime)||!validTime(wake))return 0;
  const [bedHour,bedMinute]=bedtime.split(':').map(Number);
  const [wakeHour,wakeMinute]=wake.split(':').map(Number);
  let result=wakeHour*60+wakeMinute-(bedHour*60+bedMinute);
  if(result<=0)result+=1440;
  return result;
}

export function formatDuration(minutes:number,locale:'en'|'fa'){
  if(!minutes)return locale==='fa'?'—':'—';
  const hours=Math.floor(minutes/60);const remainder=minutes%60;
  return locale==='fa'?`${hours} ساعت ${remainder} دقیقه`:`${hours}h ${remainder}m`;
}

export function useSleepCompanion(memberEmail?:string){
  const [data,setData]=useState<SleepCompanionData>(defaultData);
  const [ready,setReady]=useState(false);
  const [syncStatus,setSyncStatus]=useState<SyncStatus>('idle');
  const touch=useCallback((transform:(current:SleepCompanionData)=>SleepCompanionData)=>{
    setData(current=>normalise({...transform(current),updatedAt:new Date().toISOString()}));
  },[]);

  useEffect(()=>{
    try{const saved=localStorage.getItem(key);setData(saved?normalise(JSON.parse(saved)):legacyData());}catch{setData(legacyData());}
    setReady(true);
  },[]);
  useEffect(()=>{if(ready)localStorage.setItem(key,JSON.stringify(data));},[data,ready]);

  const setFocus=useCallback((focus:SleepFocus)=>touch(current=>({...current,focus})),[touch]);
  const setPlan=useCallback((plan:string)=>touch(current=>({...current,plan:plan.slice(0,5000)})),[touch]);
  const toggleHabit=useCallback((index:number)=>touch(current=>({...current,habits:current.habits.map((value,i)=>i===index?!value:value)})),[touch]);
  const toggleLesson=useCallback((id:string)=>touch(current=>({...current,completedLessons:current.completedLessons.includes(id)?current.completedLessons.filter(item=>item!==id):[...current.completedLessons,id]})),[touch]);
  const saveCheckin=useCallback((checkin:Omit<SleepCheckin,'date'> & {date?:string})=>touch(current=>{
    const row:SleepCheckin={...checkin,date:checkin.date||localDay()};
    return {...current,checkins:[...current.checkins.filter(item=>item.date!==row.date),row].sort((a,b)=>a.date.localeCompare(b.date)).slice(-120)};
  }),[touch]);
  const clearDevice=useCallback(()=>{localStorage.removeItem(key);setData(defaultData());setSyncStatus('idle');},[]);

  const sync=useCallback(async()=>{
    if(!memberEmail){setSyncStatus('error');return false;}
    setSyncStatus('syncing');
    try{
      const remoteResponse=await fetch('/api/user/data',{cache:'no-store'});
      if(!remoteResponse.ok)throw new Error('remote_unavailable');
      const remote=await remoteResponse.json() as {version?:number;updatedAt?:string;data?:{app?:unknown}};
      const remoteApp=remote.data?.app?normalise(remote.data.app):null;
      if(remoteApp&&Date.parse(remoteApp.updatedAt)>Date.parse(data.updatedAt)){
        setData(remoteApp);setSyncStatus('restored');return true;
      }
      const app=normalise({...data,updatedAt:new Date().toISOString()});
      const payload={schema:1,updatedAt:app.updatedAt,checklist:[...app.habits,false],plan:app.plan,diary:app.checkins.slice(-7).map(row=>({date:row.date,bed:row.bedtime,wake:row.wake,quality:String(row.quality),note:row.focus})),app};
      const save=await fetch('/api/user/data',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:remote.version??0,data:payload})});
      if(save.status===409){setSyncStatus('error');return false;}
      if(!save.ok)throw new Error('save_failed');
      setData(app);setSyncStatus('saved');return true;
    }catch{setSyncStatus('error');return false;}
  },[data,memberEmail]);

  const metrics=useMemo(()=>{
    const recent=data.checkins.slice(-7);const durations=recent.map(item=>sleepDurationMinutes(item.bedtime,item.wake)).filter(Boolean);
    const quality=recent.length?Math.round(recent.reduce((total,item)=>total+item.quality,0)/recent.length*10)/10:null;
    const average=durations.length?Math.round(durations.reduce((total,item)=>total+item,0)/durations.length):0;
    const progress=data.habits.filter(Boolean).length+data.completedLessons.length+Math.min(2,recent.length);
    return {recent,quality,average,progress,habitCount:data.habits.filter(Boolean).length};
  },[data]);

  return {data,ready,metrics,syncStatus,setFocus,setPlan,toggleHabit,toggleLesson,saveCheckin,sync,clearDevice};
}
