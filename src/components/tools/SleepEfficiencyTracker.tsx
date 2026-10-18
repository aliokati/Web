"use client";

import { useState } from "react";
import { Locale } from "@/i18n/config";
import { Zap, Sliders, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface TrackerProps {
  locale: Locale;
}

export default function SleepEfficiencyTracker({ locale }: TrackerProps) {
  const isRtl = locale === "fa";
  const [bedHours, setBedHours] = useState<number>(8);
  const [sleepHours, setSleepHours] = useState<number>(7);

  // Clinical Equation: Efficiency = (Total Sleep Time / Total Time in Bed) * 100
  const efficiency = Math.min(100, Math.round((sleepHours / bedHours) * 100));
  
  // Calculate sleep debt below general target thresholds (e.g. 7.5 hours)
  const structuralTarget = 7.5;
  const debt = Math.max(0, parseFloat((structuralTarget - sleepHours).toFixed(1)));

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-sky-400" />
        <h3 className="text-lg font-bold text-white">
          {isRtl ? "محاسبه‌گر بازدهی و کسری خواب" : "Sleep Efficiency & Debt Simulator"}
        </h3>
      </div>

      {/* Input Slider Matrix */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{isRtl ? "زمان حضور در رختخواب:" : "Total Duration in Bed:"}</span>
            <span className="text-sky-400 font-bold">{bedHours} {isRtl ? "ساعت" : "Hours"}</span>
          </div>
          <input
            type="range"
            min="4"
            max="12"
            step="0.5"
            value={bedHours}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBedHours(val);
              if (sleepHours > val) setSleepHours(val);
            }}
            className="w-full accent-sky-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{isRtl ? "مدت زمان خواب واقعی:" : "Actual Sleep Duration:"}</span>
            <span className="text-indigo-400 font-bold">{sleepHours} {isRtl ? "ساعت" : "Hours"}</span>
          </div>
          <input
            type="range"
            min="4"
            max={bedHours}
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Live Data Visualizer Panels */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">
            {isRtl ? "بازدهی خواب بالینی" : "Sleep Efficiency Index"}
          </span>
          <span className={`text-2xl font-mono font-black ${efficiency >= 85 ? "text-emerald-400" : "text-amber-400"}`}>
            {efficiency}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">
            {isRtl ? "میزان کسری خواب روزانه" : "Daily Sleep Debt"}
          </span>
          <span className={`text-2xl font-mono font-black ${debt > 0 ? "text-rose-400" : "text-emerald-400"}`}>
            {debt} {isRtl ? "ساعت" : "hrs"}
          </span>
        </div>
      </div>

      {/* Dynamic Recommendation Block */}
      {efficiency < 85 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-300 text-xs flex gap-2 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p>
            {isRtl 
              ? "بازدهی خواب زیر ۸۵٪ نشان‌دهنده بیداری‌های مکرر یا تأخیر زیاد در شروع خواب است. کاهش زمان غیرمفید در رختخواب (تکنیک محدودیت خواب) توصیه می‌شود"
              : "Sleep efficiency below 85% points to fragmentation or prolonged onset latency. Consider practicing structural stimulus control strategies"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
