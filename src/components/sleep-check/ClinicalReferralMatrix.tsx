"use client";

import { Locale } from "@/i18n/config";
import { CLINICAL_DOMAINS } from "@/config/clinicalDomains";
import { ArrowRight, AlertTriangle, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ReferralMatrixProps {
  locale: Locale;
  scores: Record<string, number>;
}

export default function ClinicalReferralMatrix({ locale, scores }: ReferralMatrixProps) {
  const isRtl = locale === "fa";

  // Evaluate which clinical tracking vectors cross domain thresholds
  const triageAnalysis = Object.entries(CLINICAL_DOMAINS).map(([key, domain]) => {
    const rawScore = scores[key] || 0;
    const isTriggered = rawScore >= domain.thresholdScore;
    
    return {
      ...domain,
      score: rawScore,
      isTriggered
    };
  });

  const hasTriggers = triageAnalysis.some(item => item.isTriggered);

  return (
    <div className="space-y-6 w-full mt-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-md">
        <h4 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          {isRtl ? "تحلیل تریاژ بالینی خواب" : "Clinical Sleep Triage Matrix"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {triageAnalysis.map((domain) => (
            <div 
              key={domain.id} 
              className={`p-4 rounded-xl border transition-all ${
                domain.isTriggered 
                  ? "border-amber-500/20 bg-amber-500/5" 
                  : "border-slate-900 bg-slate-900/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-sm font-semibold text-slate-200">
                  {isRtl ? domain.nameFa : domain.nameEn}
                </h5>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  domain.isTriggered ? "bg-amber-500/20 text-amber-400" : "bg-slate-900 text-slate-500"
                }`}>
                  {domain.score.toFixed(1)} / 4.0
                </span>
              </div>
              
              <p className="text-xs text-slate-500 font-mono mb-4">
                {isRtl ? `ابزار سنجش مرجع: ${domain.goldStandardInstrument}` : `Reference Class: ${domain.goldStandardInstrument}`}
              </p>

              {domain.isTriggered && (
                <Link
                  href={`${domain.detailedTrackRoute}?lang=${locale}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
                >
                  {isRtl ? "شروع ارزیابی تشخیصی تخصصی" : "Begin Detailed Diagnostic Assessment"}
                  {isRtl ? (
                    <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Unified Multi-Track Dynamic Routing Disclaimer Alert */}
      {hasTriggers && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-sky-500/10 bg-sky-500/5 flex gap-3 text-xs sm:text-sm text-sky-300/90 leading-relaxed"
        >
          <AlertTriangle className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <p>
            {isRtl 
              ? "سیستم کریسم شناسایی کرده است که یک یا چند شاخص خواب شما بالاتر از آستانه غربالگری اولیه قرار دارد. پیشنهاد می‌شود جهت دسترسی به مسیرهای درمانی معتبر تخصصی، تست‌های تفصیلی مربوطه را تکمیل فرمایید."
              : "Core indicators have crossed standard clinical screening boundaries. It is highly recommended to attend the designated, detailed modular diagnostic evaluation tracks mapped above."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
