export type QuestionnaireAnswer = string | number;
export type AssessmentRecord = {
  slug: string;
  completedAt: string;
  score: number;
  maxScore: number;
  interpretationEn: string;
  interpretationFa: string;
  actionEn: string;
  actionFa: string;
  answers: Record<string, QuestionnaireAnswer>;
};

const key = 'krism-questionnaire-history-v1';
const draftKey = (slug: string) => `krism-questionnaire-draft-${slug}-v1`;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readQuestionnaireDraft<T extends Record<string, QuestionnaireAnswer>>(slug: string): T | null {
  if (!canUseStorage()) return null;
  try { return JSON.parse(window.localStorage.getItem(draftKey(slug)) || 'null') as T | null; } catch { return null; }
}

export function writeQuestionnaireDraft(slug: string, answers: Record<string, QuestionnaireAnswer>) {
  if (!canUseStorage()) return;
  try { window.localStorage.setItem(draftKey(slug), JSON.stringify(answers)); } catch { /* storage is optional */ }
}

export function clearQuestionnaireDraft(slug: string) {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(draftKey(slug));
}

export function saveQuestionnaireResult(record: AssessmentRecord) {
  if (!canUseStorage()) return;
  try {
    const current = JSON.parse(window.localStorage.getItem(key) || '[]') as AssessmentRecord[];
    const next = [record, ...current.filter(item => item.slug !== record.slug)].slice(0, 12);
    window.localStorage.setItem(key, JSON.stringify(next));
    clearQuestionnaireDraft(record.slug);
  } catch { /* storage is optional */ }
}

export function readQuestionnaireResults(): AssessmentRecord[] {
  if (!canUseStorage()) return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
