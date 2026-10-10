import {graphicOptions, type RecordData} from './content-model';
export class CmsError extends Error {constructor(public code: string, public status = 400) {super(code);}}
const strings = ['title','name','category','description','excerpt','readTime','reviewedAt','source','role','specialty','institution','biography','audience','publishedAt'] as const;
const lists = ['content','takeaways','practicalSteps','warningSigns','relatedSlugs','education','appointments','researchInterests','selectedPublications'] as const;
const links = ['url','downloadUrl','googleScholar','orcid','pubmed'] as const;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validSlug(value: unknown): value is string {return typeof value === 'string' && value.length <= 100 && slugPattern.test(value);}
export function safeUrl(value: string) {
  try {const url = new URL(value); return ['https:','http:'].includes(url.protocol) && !url.username && !url.password;} catch {return false;}
}
export function validateRecord(input: unknown, translated = false): RecordData {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new CmsError('invalid_content');
  const data = input as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  if (!translated) {if (!validSlug(data.slug)) throw new CmsError('invalid_slug'); output.slug = data.slug;}
  for (const key of strings) {
    if (data[key] === undefined) continue;
    if (typeof data[key] !== 'string' || (data[key] as string).length > (key === 'biography' ? 20000 : 4000)) throw new CmsError('invalid_content');
    output[key] = (data[key] as string).trim();
  }
  for (const key of lists) {
    if (data[key] === undefined) continue;
    if (!Array.isArray(data[key]) || data[key].length > 200 || data[key].some((x: unknown) => typeof x !== 'string' || x.length > 20000)) throw new CmsError('invalid_content');
    output[key] = (data[key] as string[]).map(x => x.trim()).filter(Boolean);
    if (key === 'relatedSlugs' && (output[key] as string[]).some(x => !validSlug(x))) throw new CmsError('invalid_related');
  }
  for (const key of links) {
    if (data[key] === undefined || data[key] === '') continue;
    if (typeof data[key] !== 'string' || data[key].length > 2048 || !safeUrl(data[key])) throw new CmsError('invalid_link');
    output[key] = data[key];
  }
  if (!translated) {
    if (!(output.title || output.name)) throw new CmsError('title_required');
    if (data.graphic && (typeof data.graphic !== 'string' || !graphicOptions.includes(data.graphic))) throw new CmsError('invalid_graphic');
    if (data.graphic) output.graphic = data.graphic;
    if (data.photo) {
      if (typeof data.photo !== 'string' || !(/^\/(?:public\/)?images\/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp|gif)$/i.test(data.photo) || /^\/api\/media\/[a-f0-9-]{36}\.webp$/.test(data.photo)) || data.photo.includes('..')) throw new CmsError('invalid_photo');
      output.photo = data.photo.replace(/^\/public\//, '/');
    }
    for (const key of ['featured','internalPage','profileConsent']) {if (data[key] !== undefined) {if (typeof data[key] !== 'boolean') throw new CmsError('invalid_content'); output[key] = data[key];}}
    if (data.displayOrder !== undefined) {if (!Number.isSafeInteger(data.displayOrder) || Math.abs(data.displayOrder as number) > 100000) throw new CmsError('invalid_order'); output.displayOrder = data.displayOrder;}
    output.status = 'published';
    output.translationStatus = data.translationStatus === 'published' ? 'published' : 'draft';
    if (data.translations !== undefined) {
      if (!data.translations || typeof data.translations !== 'object' || Array.isArray(data.translations)) throw new CmsError('invalid_content');
      const fa = (data.translations as {fa?: unknown}).fa;
      if (fa !== undefined) output.translations = {fa: validateRecord(fa, true)};
    }
    if (output.translationStatus === 'published') {
      const fa = (output.translations as RecordData['translations'])?.fa;
      if (!fa?.title && !fa?.name) throw new CmsError('translation_title_required');
    }
  }
  return output as unknown as RecordData;
}
