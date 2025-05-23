export interface Exam {
  id: string;
  name: string;
  fullName: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  fees: string;
  eligibility: string[];
  subjects: string[];
  venues: string[];
  documentUrl?: string;
  resultDate?: string;
  organizingBody: string;
  imageUrl?: string;
  level: 'primary' | 'secondary' | 'tertiary';
}