import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const specs=[
  ['psqiTrackData.ts','PSQI_QUESTIONS',19,21,0,true],
  ['meqTrackData.ts','MEQ_QUESTIONS',19,86,16,true],
  ['irlsTrackData.ts','IRLS_QUESTIONS',10,40,0,true],
  ['essTrackData.ts','ESS_QUESTIONS',8,24,0,true],
  ['isiTrackData.ts','ISI_QUESTIONS',7,28,0,true],
  ['stopBangTrackData.ts','STOP_BANG_QUESTIONS',8,8,0,false],
  ['gapsTrackData.ts','GAPS_QUESTIONS',4,16,0,true],
];
const failures=[];
for(const [file,constant,count,max,min,hasInterpretation] of specs){
 const source=fs.readFileSync(path.join(root,'src','config',file),'utf8');
 const match=source.match(new RegExp(`export const ${constant}[^=]*=\\s*\\[(.*?)\\]\\s*;`,'s'));
 const block=match?.[1]||'';
 const found=(block.match(/\bid\s*:/g)||[]).length;
 if(found!==count)failures.push(`${constant}: expected ${count} items, found ${found}`);
 if(hasInterpretation){
  const ranges=[...source.matchAll(/minScore:\s*(\d+)[\s\S]*?maxScore:\s*(\d+)/g)].map(m=>[Number(m[1]),Number(m[2])]);
  if(!ranges.length)failures.push(`${constant}: interpretation table missing`);
  else if(!ranges.some(r=>r[0]===min)||!ranges.some(r=>r[1]===max))failures.push(`${constant}: interpretation does not span ${min}-${max}`);
 }
}
const registry=fs.readFileSync(path.join(root,'src','config','questionnaireRegistry.ts'),'utf8');
for(const [code,count,max] of [['PSQI',19,21],['MEQ',19,86],['IRLS',10,40]]){const line=registry.split('\n').find(x=>x.includes(`code:'${code}'`));if(!line||!line.includes(`items:${count}`)||!line.includes(`maxScore:${max}`))failures.push(`registry ${code}: metadata mismatch`)}
if(failures.length){console.error('Questionnaire integrity failed');for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log(`Questionnaire integrity passed for ${specs.length} tracks and registry metadata.`);