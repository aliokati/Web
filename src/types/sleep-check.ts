export interface Question {
  id: string;
  category: "insomnia" | "apnea" | "circadian" | "parasomnia" | "movement" | "hypersomnia";
  textEn: string;
  textFa: string;
  weight: number; 
}

export interface SleepCheckState {
  currentStep: number;
  answers: Record<string, number>; // questionId -> numerical score (0 to 4)
  isCompleted: boolean;
  setAnswer: (questionId: string, score: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetCheck: () => void;
  calculateResults: () => Record<string, number>;
}
