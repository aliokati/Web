"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PSQI_QUESTIONS, PSQI_INTERPRETATION } from "@/config/psqiTrackData";
import { ArrowLeft, Sliders, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PsqiTrackPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale === "fa" ? "fa" : "en";
  const isRtl = locale === "fa";

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleSelect = (qId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const isComplete = PSQI_QUESTIONS.every(q => answers[q.id] !== undefined);

  const evaluation = PSQI_INTERPRETATION.find(
    range => totalScore >= range.minScore && totalScore <= range.maxScore
  ) || PSQI_INTERPRETATION[1];

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto w-full">
      <div className={`w-full mb-8 ${isRtl ? "text-right" : "text-left"}`}>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          {isRtl ? "شاخص کیفیت خواب پیتسبورگ (PSQI)" : "Pittsburgh Sleep Quality Index (PSQI)"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isRtl ? "کیفیت ذهنی و الگوهای مخدوش خواب خود را در بازه یک ماه اخیر ارزیابی کنید." : "Rate macro quality and sleep stability disruption variables over a 1-month framework."}
        </p>
      </div>

      {!isEvaluated ? (
        <div className="w-full space-y-4">
          {PSQI_QUESTIONS.map((q, idx) => (
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
            {isRtl ? "محاسبه شاخص کیفیت جهانی پیتسبورگ" : "Compile Global PSQI Quality Metrics"}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <span className="text-sm font-mono text-slate-400">{isRtl ? "امتیاز مأخوذه پیتسبورگ:" : "Pittsburgh Component Score Summary:"}</span>
            <span className="text-2xl font-mono font-black text-sky-400">{totalScore} / 9</span>
          </div>

          <div className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/10 mb-6 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Sliders className="w-5 h-5 text-sky-400" />
              {isRtl ? evaluation.severityFa : evaluation.severityEn}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isRtl ? evaluation.actionFa : evaluation.actionEn}
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
