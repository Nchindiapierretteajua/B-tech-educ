export interface GuideStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., 'school-registration', 'scholarships', 'exams'
  audience: 'student' | 'parent' | 'graduate' | 'all';
  steps: GuideStep[];
  lastUpdated: string;
  imageUrl?: string;
}