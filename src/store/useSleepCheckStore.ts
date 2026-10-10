import { create } from "zustand";
import { SleepCheckState } from "../types/sleep-check";

export const useSleepCheckStore = create<SleepCheckState>((set, get) => ({
  currentStep: 0,
  answers: {},
  isCompleted: false,

  setAnswer: (questionId, score) => set((state) => ({
    answers: { ...state.answers, [questionId]: score }
  })),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

  resetCheck: () => set({ currentStep: 0, answers: {}, isCompleted: false }),

  calculateResults: () => {
    const { answers } = get();
    // Initialize standard tracking categories
    const categories = {
      insomnia: 0,
      apnea: 0,
      circadian: 0,
      parasomnia: 0,
      movement: 0,
      hypersomnia: 0,
    };

    // Calculate aggregated scores based on user answers
    // Here you can plug in custom weights from your clinical criteria
    Object.entries(answers).forEach(([key, value]) => {
      // Basic category distribution mapping logic
      if (key.startsWith("ins")) categories.insomnia += value;
      else if (key.startsWith("apn")) categories.apnea += value;
      else if (key.startsWith("cir")) categories.circadian += value;
      else if (key.startsWith("par")) categories.parasomnia += value;
      else if (key.startsWith("mov")) categories.movement += value;
      else if (key.startsWith("hyp")) categories.hypersomnia += value;
    });

    return categories;
  }
}));
