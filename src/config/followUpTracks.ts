import type {Category,GuideState} from '@/lib/sleep-guide';
export const followUpTracks: {slug:string;code:string;en:string;fa:string;category?:Category}[] = [
 {slug:'isi',code:'ISI',en:'Insomnia',fa:'بی‌خوابی',category:'insomnia'},
 {slug:'stop-bang',code:'STOP-BANG',en:'Sleep-related breathing',fa:'تنفس در خواب',category:'breathing'},
 {slug:'ess',code:'ESS',en:'Daytime sleepiness',fa:'خواب‌آلودگی روزانه',category:'sleepiness'},
 {slug:'meq',code:'MEQ',en:'Sleep timing',fa:'زمان‌بندی خواب',category:'circadian'},
 {slug:'irls',code:'IRLS',en:'Restless legs',fa:'پای بی‌قرار',category:'movement'},
 {slug:'gaps',code:'GAPS',en:'Unusual sleep behaviors',fa:'رفتارهای غیرمعمول در خواب',category:'parasomnia'},
 {slug:'psqi',code:'PSQI',en:'Overall sleep quality',fa:'کیفیت کلی خواب'},
];
export function canShowFollowUps(state:GuideState){return state.mode==='result'&&(!state.special||state.special==='none');}
export function relatedTrackSlugs(scores:Partial<Record<Category,number>>,primary?:Category){return followUpTracks.filter(track=>track.category&&(track.category===primary||(scores[track.category]||0)>=2)).map(track=>track.slug);}
