export interface ContactFormInput {
  senderName: string;
  senderEmail: string;
  affiliationType: "public" | "professional" | "researcher";
  messageSubject: string;
  messageBody: string;
}

export interface ContactLabels {
  heading: string;
  subheading: string;
  nameLabel: string;
  emailLabel: string;
  typeLabel: string;
  subjectLabel: string;
  bodyLabel: string;
  submitBtn: string;
  successMsg: string;
  orgEmailLabel: string;
  locationLabel: string;
  typePublic: string;
  typeProfessional: string;
  typeResearcher: string;
}
