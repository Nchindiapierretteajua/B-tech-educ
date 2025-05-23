export interface Scholarship {
  id: string;
  title: string;
  description: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  requirements: string[];
  applicationUrl: string;
  type: string; // e.g., 'undergraduate', 'postgraduate', 'research'
  country: string; // country offering the scholarship
  imageUrl?: string;
  lastUpdated: string;
}