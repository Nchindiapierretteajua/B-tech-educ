export interface BaseEntity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam extends BaseEntity {
  type: 'Academic' | 'Professional' | 'Entrance';
  date: string;
  registrationDeadline: string;
  location: string;
  requirements: string[];
  fee: number;
  website?: string;
}

export interface Scholarship extends BaseEntity {
  type: 'Merit' | 'Need' | 'Sports' | 'Research';
  amount: number;
  deadline: string;
  requirements: string[];
  website?: string;
  organization: string;
}

export interface Guide extends BaseEntity {
  category: 'Study' | 'Career' | 'Life Skills';
  content: string;
  author: string;
  tags: string[];
  readingTime: number; // in minutes
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface FilterState {
  search: string;
  categories: string[];
  dateRange?: DateRange;
}

export interface Bookmark {
  id: string;
  type: 'exam' | 'scholarship' | 'guide';
  itemId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface Preferences {
  notifications: boolean;
  darkMode: boolean;
  offlineMode: boolean;
}
