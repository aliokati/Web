"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ESS_QUESTIONS, ESS_OPTIONS, ESS_INTERPRETATION } from "@/config/essTrackData";
import { ArrowLeft, Brain, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function EssTrackPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale === "fa" ? "fa" : "en";
  const isRtl = locale === "fa";

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleSelect = (qId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const isComplete = ESS_QUESTIONS.every(q => answers[q.id] !== undefined);

  const evaluation = ESS_INTERPRETATION.find(
    range => totalScore >= range.minScore && totalScore <= range.maxScore
  );

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto w-full">
      <div className={`w-full mb-8 ${isRtl ? "text-right" : "text-left"}`}>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          {isRtl ? "مقیاس خواب‌آلودگی اپورث (ESS)" : "Epworth Sleepiness Scale (ESS)"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isRtl ? "احتمال چرت زدن خود را در موقعیت‌های معمول زندگی روزمره ارزیابی کنید" : "Rate your recent likelihood of dozing off during standard daily tasks"}
        </p>
      </div>

      {!isEvaluated ? (
        <div className="w-full space-y-4">
          {ESS_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col space-y-3">
              <h3 className="text-xs sm:text-sm font-medium text-slate-200">
                {idx + 1}. {isRtl ? q.textFa : q.textEn}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ESS_OPTIONS.map(opt => (
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
                    <span className="font-mono font-bold mr-2 ml-2">({opt.score})</span>
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
            {isRtl ? "محاسبه میزان هوشیاری و خواب‌آلودگی" : "Calculate Hypersomnolence Metrics"}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <span className="text-sm font-mono text-slate-400">{isRtl ? "نمره کل ESS:" : "Total ESS score:"}</span>
            <span className="text-2xl font-mono font-black text-sky-400">{totalScore} / 24</span>
          </div>

          <div className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/10 mb-6 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Brain className="w-5 h-5 text-sky-400" />
              {isRtl ? evaluation?.severityFa : evaluation?.severityEn}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isRtl ? evaluation?.actionFa : evaluation?.actionEn}
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-5">{isRtl ? "ESS فقط خواب‌آلودگی روزانه را اندازه می‌گیرد و علت آن را تشخیص نمی‌دهد. هنگام خواب‌آلودگی رانندگی نکنید" : "ESS measures daytime sleep propensity; it does not identify the cause. Do not drive when sleepy"}</p><button onClick={() => { setIsEvaluated(false); setAnswers({}); }} className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {isRtl ? "تست مجدد" : "Retake Track"}
          </button>
        </motion.div>
      )}
    </main>
  );
}
