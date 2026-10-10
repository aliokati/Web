'use client';
import {useEffect,useState} from 'react';

type InstallEvent=Event & {prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
export default function PwaRegistration(){
 const [installEvent,setInstallEvent]=useState<InstallEvent|null>(null); const [visible,setVisible]=useState(false);
 useEffect(()=>{if('serviceWorker' in navigator&&process.env.NODE_ENV==='production')navigator.serviceWorker.register('/sw.js').catch(()=>undefined);const onInstall=(event:Event)=>{event.preventDefault();setInstallEvent(event as InstallEvent);if(localStorage.getItem('krism-install-dismissed')!=='1')setVisible(true)};window.addEventListener('beforeinstallprompt',onInstall);return()=>window.removeEventListener('beforeinstallprompt',onInstall)},[]);
 async function install(){if(!installEvent)return;await installEvent.prompt();const choice=await installEvent.userChoice;if(choice.outcome==='accepted')setVisible(false);setInstallEvent(null)}
 if(!visible)return null;return <aside className="install-prompt" aria-label="Install KRISM"><div><b>Make KRISM your sleep space</b><span>Keep your tools one tap away, even offline.</span></div><button className="primary-button" onClick={install}>Install</button><button className="text-button" onClick={()=>{localStorage.setItem('krism-install-dismissed','1');setVisible(false)}} aria-label="Dismiss install prompt">×</button></aside>;
}