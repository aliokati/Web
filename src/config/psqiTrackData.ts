import { TrackQuestion, TrackScoreInterpretation } from "@/types/diagnostic-tracks";

export const PSQI_QUESTIONS: TrackQuestion[] = [
  { id: "q1", type: "scale-4", textEn: "During the past month, what time have you usually gone to bed?", textFa: "در طول ماه گذشته معمولاً چه ساعتی به رختخواب رفته‌اید؟" },
  { id: "q2", type: "scale-4", textEn: "During the past month, how long has it usually taken you to fall asleep (minutes)?", textFa: "در طول ماه گذشته معمولاً چند دقیقه طول کشیده تا خوابتان ببرد؟" },
  { id: "q3", type: "scale-4", textEn: "During the past month, what time have you usually gotten up?", textFa: "در طول ماه گذشته معمولاً چه ساعتی از خواب بیدار شده‌اید؟" },
  { id: "q4", type: "scale-4", textEn: "During the past month, how many hours of actual sleep did you get at night?", textFa: "در طول ماه گذشته واقعاً چند ساعت در شب خوابیده‌اید؟" },
  { id: "q5a", type: "scale-4", textEn: "Could not get to sleep within 30 minutes.", textFa: "نتوانستم ظرف ۳۰ دقیقه به خواب بروم." },
  { id: "q5b", type: "scale-4", textEn: "Woke up in the middle of the night or early morning.", textFa: "نیمه‌شب یا صبح زود از خواب بیدار شدم." },
  { id: "q5c", type: "scale-4", textEn: "Had to get up to use the bathroom.", textFa: "برای رفتن به دستشویی مجبور شدم از رختخواب خارج شوم." },
  { id: "q5d", type: "scale-4", textEn: "Could not breathe comfortably.", textFa: "نتوانستم به راحتی نفس بکشم." },
  { id: "q5e", type: "scale-4", textEn: "Coughed or snored loudly.", textFa: "سرفه کردم یا با صدای بلند خروپف کردم." },
  { id: "q5f", type: "scale-4", textEn: "Felt too cold.", textFa: "احساس سرمای زیاد داشتم." },
  { id: "q5g", type: "scale-4", textEn: "Felt too hot.", textFa: "احساس گرمای زیاد داشتم." },
  { id: "q5h", type: "scale-4", textEn: "Had bad dreams.", textFa: "خواب‌های بد دیدم." },
  { id: "q5i", type: "scale-4", textEn: "Had pain.", textFa: "درد داشتم." },
  { id: "q5j", type: "scale-4", textEn: "Other reason (describe separately if needed).", textFa: "دلیل دیگری (در صورت نیاز جداگانه توضیح دهید)." },
  { id: "q6", type: "scale-4", textEn: "Overall, how would you rate your sleep quality?", textFa: "در مجموع کیفیت خواب خود را چگونه ارزیابی می‌کنید؟" },
  { id: "q7", type: "scale-4", textEn: "How often have you taken medicine to help you sleep?", textFa: "چند وقت یک‌بار برای خوابیدن دارو مصرف کرده‌اید؟" },
  { id: "q8", type: "scale-4", textEn: "How often have you had trouble staying awake while driving, eating meals, or engaging in social activity?", textFa: "چند وقت یک‌بار هنگام رانندگی، غذا خوردن یا فعالیت اجتماعی در بیدار ماندن مشکل داشته‌اید؟" },
  { id: "q9", type: "scale-4", textEn: "How much of a problem has it been to keep up enough enthusiasm to get things done?", textFa: "حفظ انرژی و اشتیاق کافی برای انجام کارها چقدر مشکل بوده است؟" },
  { id: 'q10', type: 'scale-4', textEn: 'If you share a bed or room, how often has another person noticed sleep-related disturbances?', textFa: 'اگر با فرد دیگری اتاق یا تخت مشترک دارید، چند وقت یک‌بار او اختلالات مرتبط با خواب را مشاهده کرده است؟' },
];
export const PSQI_FREQUENCY = [
 {score:0,textEn:"Not during the past month",textFa:"در طول ماه گذشته اصلاً"}, {score:1,textEn:"Less than once a week",textFa:"کمتر از یک بار در هفته"}, {score:2,textEn:"Once or twice a week",textFa:"یک یا دو بار در هفته"}, {score:3,textEn:"Three or more times a week",textFa:"سه بار یا بیشتر در هفته"},
];
export const PSQI_INTERPRETATION: TrackScoreInterpretation[] = [
 {minScore:0,maxScore:5,severityEn:"Better sleep quality range",severityFa:"محدوده کیفیت خواب بهتر",actionEn:"This screening score is not a diagnosis. Keep monitoring your sleep and concerns.",actionFa:"این امتیاز غربالگری تشخیص پزشکی نیست. خواب و نگرانی‌های خود را پیگیری کنید."},
 {minScore:6,maxScore:21,severityEn:"Poor sleep quality range",severityFa:"محدوده کیفیت خواب پایین‌تر",actionEn:"A score above 5 is commonly used to flag possible poor sleep quality; discuss persistent problems with a clinician.",actionFa:"امتیاز بالاتر از ۵ معمولاً برای احتمال کیفیت خواب پایین به کار می‌رود؛ مشکلات پایدار را با پزشک مطرح کنید."},
];

