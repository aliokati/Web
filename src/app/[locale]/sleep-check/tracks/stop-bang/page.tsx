"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { STOP_BANG_QUESTIONS } from "@/config/stopBangTrackData";
import { ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function StopBangTrackPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale === "fa" ? "fa" : "en";
  const isRtl = locale === "fa";

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleSelect = (qId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const isComplete = STOP_BANG_QUESTIONS.every(q => answers[q.id] !== undefined);

  // STOP-BANG clinical risk mapping logic
  let riskLevelEn = "Low Risk of Obstructive Sleep Apnea";
  let riskLevelFa = "ریسک پایین آپنه انسدادی خواب";
  let actionEn = "No clear structural intervention required based on primary indices.";
  let actionActionFa = "بر اساس شاخص‌های اولیه، نیاز مبرمی به مداخله ساختاری فوری وجود ندارد.";
  let riskColorClass = "bg-emerald-500/5 border-emerald-500/10 text-emerald-400";

  const stopScore=(answers["sb_snore"]||0)+(answers["sb_tired"]||0)+(answers["sb_observed"]||0)+(answers["sb_pressure"]||0);
  const intermediateHigh=stopScore>=2&&(answers["sb_gender"]===1||answers["sb_bmi"]===1||answers["sb_neck"]===1);
  if (totalScore >= 5 || intermediateHigh) {
    riskLevelEn = "High Risk of Obstructive Sleep Apnea";
    riskLevelFa = "ریسک بالای آپنه انسدادی خواب";
    actionEn = "Discuss diagnostic evaluation with a qualified clinician; the score does not diagnose obstructive sleep apnea.";
    actionActionFa = "برای ارزیابی تشخیصی با پزشک واجد شرایط گفت‌وگو کنید؛ این امتیاز آپنه انسدادی خواب را تشخیص نمی‌دهد.";
    riskColorClass = "bg-rose-500/5 border-rose-500/10 text-rose-400";
  } else if (totalScore >= 3) {
    riskLevelEn = "Intermediate Risk of Obstructive Sleep Apnea";
    riskLevelFa = "ریسک متوسط آپنه انسدادی خواب";
    actionEn = "Consider a clinical review, especially if you have witnessed pauses, loud snoring or daytime sleepiness.";
    actionActionFa = "به‌ویژه در صورت وقفه تنفسی مشاهده‌شده، خرخر بلند یا خواب‌آلودگی روزانه، ارزیابی بالینی را در نظر بگیرید.";
    riskColorClass = "bg-amber-500/5 border-amber-500/10 text-amber-400";
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto w-full">
      <div className={`w-full mb-8 ${isRtl ? "text-right" : "text-left"}`}>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          {isRtl ? "غربالگری اختلالات تنفسی خواب (STOP-BANG)" : "Sleep Apnea Evaluation Track (STOP-BANG)"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isRtl ? "به سوالات بیومتریک و بالینی زیر با دقت پاسخ دهید." : "Complete the standard binary clinical data queries below."}
        </p>
      </div>

      {!isEvaluated ? (
        <div className="w-full space-y-4">
          {STOP_BANG_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xs sm:text-sm font-medium text-slate-300 max-w-md">
                {idx + 1}. {isRtl ? q.textFa : q.textEn}
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                {[
                  { labelEn: "Yes", labelFa: "بله", val: 1 },
                  { labelEn: "No", labelFa: "خیر", val: 0 }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => handleSelect(q.id, opt.val)}
                    className={`px-4 py-2 rounded-lg border text-xs font-semibold font-mono tracking-wide transition-all min-w-[70px] ${
                      answers[q.id] === opt.val
                        ? "border-sky-500 bg-sky-500/10 text-sky-400"
                        : "border-slate-800 bg-slate-900/10 text-slate-500 hover:border-slate-700"
                    }`}
                  >
                    {isRtl ? opt.labelFa : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            disabled={!isComplete}
            onClick={() => setIsEvaluated(true)}
            className="w-full py-4 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-40 disabled:pointer-events-none transition-all text-sm mt-4"
          >
            {isRtl ? "تحلیل ریسک تنفسی اپیدمیولوژیک" : "Analyze Respiratory Risk Profiling"}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <span className="text-sm font-mono text-slate-400">{isRtl ? "شاخص انباشت امتیاز:" : "STOP-BANG Aggregate Index:"}</span>
            <span className="text-2xl font-mono font-black text-sky-400">{totalScore} / 8</span>
          </div>

          <div className={`p-5 rounded-2xl border ${riskColorClass} mb-6 space-y-2`}>
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <ShieldAlert className="w-5 h-5" />
              {isRtl ? riskLevelFa : riskLevelEn}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isRtl ? actionActionFa : actionEn}
            </p>
          </div>

          <div className="flex gap-3 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-200/80 text-xs mb-8">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>{isRtl ? "STOP-BANG یک ابزار غربالگری است؛ نتیجه مثبت باید با شرح‌حال و ارزیابی پزشک پیگیری شود و به‌تنهایی تشخیص نیست." : "STOP-BANG is a screening tool. A positive result should be followed by clinical history and assessment; it is not a diagnosis by itself."}</p>
          </div>

          <button onClick={() => { setIsEvaluated(false); setAnswers({}); }} className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {isRtl ? "تست مجدد" : "Retake Track"}
          </button>
        </motion.div>
      )}
    </main>
  );
}
