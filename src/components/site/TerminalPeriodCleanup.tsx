'use client';

import {useEffect} from 'react';

const trimTerminalPeriod=(value:string)=>value.replace(/\.(\s*)$/,'$1');
const textAllowed=(node:Text)=>{
  const parent=node.parentElement;
  return !!parent&&!['SCRIPT','STYLE','TEXTAREA','CODE','PRE'].includes(parent.tagName);
};
function cleanNode(root:Node){
  if(root.nodeType===Node.TEXT_NODE){if(textAllowed(root as Text)){const value=root.textContent||'';const next=trimTerminalPeriod(value);if(next!==value)root.textContent=next}return}
  if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_FRAGMENT_NODE)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let text=walker.nextNode();while(text){if(textAllowed(text as Text)){const value=text.textContent||'';const next=trimTerminalPeriod(value);if(next!==value)text.textContent=next}text=walker.nextNode()}
  if(root.nodeType===Node.ELEMENT_NODE){const element=root as HTMLElement;for(const name of ['placeholder','title','aria-label','alt']){const value=element.getAttribute(name);if(value){const next=trimTerminalPeriod(value);if(next!==value)element.setAttribute(name,next)}}}
}

export default function TerminalPeriodCleanup(){
  useEffect(()=>{
    const clean=()=>{cleanNode(document.body);document.title=trimTerminalPeriod(document.title)};
    clean();
    const observer=new MutationObserver(records=>records.forEach(record=>{record.addedNodes.forEach(cleanNode);if(record.type==='characterData')cleanNode(record.target)}));
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    return()=>observer.disconnect();
  },[]);
  return null;
}
