"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MEQ_QUESTIONS, MEQ_INTERPRETATION } from "@/config/meqTrackData";
import { ArrowLeft, Compass, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function MeqTrackPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale === "fa" ? "fa" : "en";
  const isRtl = locale === "fa";

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleSelect = (qId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const isComplete = MEQ_QUESTIONS.every(q => answers[q.id] !== undefined);

  const evaluation = MEQ_INTERPRETATION.find(
    range => totalScore >= range.minScore && totalScore <= range.maxScore
  );

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto w-full">
      <div className={`w-full mb-8 ${isRtl ? "text-right" : "text-left"}`}>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          {isRtl ? "سنجش کرونوتایپ و ریتم شبانه‌روزی (MEQ)" : "Circadian Chronotype Evaluation (MEQ)"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isRtl ? "تیپ بیولوژیکی بدنی خود (سحرخیزی یا شب‌زنده‌داری) را مشخص کنید." : "Isolate your internal biological sleep profile architecture."}
        </p>
      </div>

      {!isEvaluated ? (
        <div className="w-full space-y-4">
          {MEQ_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 space-y-3">
              <h3 className="text-xs sm:text-sm font-medium text-slate-200">
                {idx + 1}. {isRtl ? q.textFa : q.textEn}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt.score}
                    onClick={() => handleSelect(q.id, opt.score)}
                    className={`p-3 rounded-xl border text-xs text-right font-medium transition-all ${
                      isRtl ? "text-right" : "text-left"
                    } ${
                      answers[q.id] === opt.score
                        ? "border-sky-500 bg-sky-500/10 text-sky-400"
                        : "border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {isRtl ? opt.textFa : opt.textEn}
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
            {isRtl ? "تعیین تیپ بیولوژیکی ریتم شبانه‌روزی" : "Evaluate Circadian Chronotype Alignment"}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <span className="text-sm font-mono text-slate-400">{isRtl ? "امتیاز ریتم شبانه‌روزی:" : "Chronotype Scale Score:"}</span>
            <span className="text-2xl font-mono font-black text-sky-400">{totalScore} / 14</span>
          </div>

          <div className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/10 mb-6 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Compass className="w-5 h-5 text-sky-400" />
              {isRtl ? evaluation?.severityFa : evaluation?.severityEn}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isRtl ? evaluation?.actionFa : evaluation?.actionEn}
            </p>
          </div>

          <button onClick={() => { setIsEvaluated(false); setAnswers({}); }} className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {isRtl ? "تست مجدد" : "Retake Track"}
          </button>
        </motion.div>
      )}
    </main>
  );
}
