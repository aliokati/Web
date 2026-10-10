"use client";

import ClinicalReferralMatrix from "./ClinicalReferralMatrix";
import { motion, AnimatePresence } from "framer-motion";
import { useSleepCheckStore } from "@/store/useSleepCheckStore";
import { Question } from "@/types/sleep-check";
import { Locale } from "@/i18n/config";
import { ChevronLeft, ChevronRight, RefreshCw, BarChart3, AlertCircle } from "lucide-react";

interface WizardProps {
  locale: Locale;
  questions: Question[];
  labels: {
    back: string;
    next: string;
    finish: string;
    score0: string;
    score4: string;
    resultsTitle: string;
    restart: string;
    notice: string;
  };
}

export default function SleepCheckWizard({ locale, questions, labels }: WizardProps) {
  const { 
    currentStep, 
    answers, 
    setAnswer, 
    nextStep, 
    prevStep, 
    resetCheck, 
    calculateResults 
  } = useSleepCheckStore();

  const isRtl = locale === "fa";
  const totalQuestions = questions.length;
  const isEndReached = currentStep >= totalQuestions;
  const activeQuestion = questions[currentStep];

  // Dynamic progress track metrics
  const progressPercent = Math.min(100, Math.round((currentStep / totalQuestions) * 100));

  // Visual layout movement physics
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isRtl ? -200 : 200) : (isRtl ? 200 : -200),
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? (isRtl ? 200 : -200) : (isRtl ? -200 : 200),
      opacity: 0,
    }),
  };

  const handleScoreSelection = (score: number) => {
    if (!activeQuestion) return;
    setAnswer(activeQuestion.id, score);
    
    // Auto-advance with a slight delay for seamless interaction feedback
    setTimeout(() => {
      nextStep();
    }, 250);
  };

  if (isEndReached) {
    const finalScores = calculateResults();

   
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
          <BarChart3 className="w-5 h-5 text-sky-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">{labels.resultsTitle}</h2>
      </div>

      {/* The Dynamic Diagnostic Router handles customized next-step paths per domain */}
      <ClinicalReferralMatrix locale={locale} scores={finalScores} />

      <div className="flex gap-3 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-200/80 text-xs sm:text-sm mt-6 mb-8 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <p>{labels.notice}</p>
      </div>

      <button
        onClick={resetCheck}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium text-sm"
      >
        <RefreshCw className="w-4 h-4" />
        {labels.restart}
      </button>
    </motion.div>
  );
}

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upper Status Block */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs font-mono text-slate-500 tracking-wider">
        <span>{progressPercent}%</span>
        <span>{currentStep + 1} / {totalQuestions}</span>
      </div>

      {/* Dynamic Structural Progress Line */}
      <div className="h-1 w-full bg-slate-950 rounded-full mb-12 overflow-hidden border border-slate-900">
        <div 
          className="h-full bg-sky-500 transition-all duration-300 ease-out" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Slide Container Panel */}
      <div className="relative overflow-hidden min-h-[340px] px-1">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentStep}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-8 leading-snug">
              {isRtl ? activeQuestion.textFa : activeQuestion.textEn}
            </h3>

            {/* Assessment Input Matrix Stack */}
            <div className="grid grid-cols-1 gap-3">
              {[0, 1, 2, 3, 4].map((score) => {
                const isSelected = answers[activeQuestion.id] === score;
                
                // Text metric allocation range map
                let scoreLabel = "";
                if (score === 0) scoreLabel = labels.score0;
                if (score === 4) scoreLabel = labels.score4;

                return (
                  <button
                    key={score}
                    onClick={() => handleScoreSelection(score)}
                    className={`flex items-center justify-between w-full p-4 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${
                      isRtl ? "text-right" : "text-left"
                    } ${
                      isSelected 
                        ? "border-sky-500 bg-sky-500/10 text-sky-400" 
                        : "border-slate-800/80 bg-slate-900/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-mono border ${
                        isSelected ? "border-sky-400 bg-sky-500/20" : "border-slate-700"
                      }`}>
                        {score}
                      </span>
                      <span className="text-xs font-normal text-slate-400 font-mono tracking-wider">{scoreLabel}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Layout Footer Direction Toggles */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-900">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-300 disabled:opacity-0 disabled:pointer-events-none transition-colors"
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {labels.back}
        </button>

        <button
          onClick={nextStep}
          disabled={answers[activeQuestion.id] === undefined}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          {labels.next}
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
