export interface BoardMember {
  id: string;
  nameEn: string;
  nameFa: string;
  roleEn: string;
  roleFa: string;
  academicTitleEn: string;
  academicTitleFa: string;
  institutionEn: string;
  institutionFa: string;
  focusAreaEn: string;
  focusAreaFa: string;
  orcid?: string;
  avatarUrl?: string;
}

export interface BoardLabels {
  heading: string;
  subheading: string;
  searchPlaceholder: string;
  focusLabel: string;
  orcidLabel: string;
  noMembers: string;
  councilType: string;
}
