export interface Practitioner {
  id: string;
  nameEn: string;
  nameFa: string;
  specialtyEn: string;
  specialtyFa: string;
  affiliationEn: string;
  affiliationFa: string;
  locationEn: string;
  locationFa: string;
  registryId: string;
  isVerified: boolean;
}

export interface OnboardingState {
  fullName: string;
  medicalLicense: string;
  specialty: string;
  institution: string;
  submissionStatus: "idle" | "submitting" | "success" | "error";
}
