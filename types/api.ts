/* eslint-disable prettier/prettier */
// Types based on the API documentation provided for PubCam Student Guide backend

// -------------------
// 1. Exams
// -------------------

export type ExamLevel = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
// Note: API doc for POST /api/exams mentions more specific levels for validation:
// 'PRIMARY', 'SECONDARY_GENERAL', 'SECONDARY_TECHNICAL', 'HIGHER_EDUCATION', 'PROFESSIONAL'.
// Using the simpler ExamLevel from the Exam data model for now, adjust if needed.

export interface Exam {
  id: string;                    // Unique identifier (auto-generated)
  name: string;                  // Short name of the exam (e.g., "GCE O/L")
  fullName: string;              // Full name of the exam (e.g., "General Certificate of Education Ordinary Level")
  description: string;           // Detailed description of the exam
  startDate: string;             // ISO 8601 DateTime string (e.g., "2025-05-15T08:00:00.000Z")
  endDate: string;               // ISO 8601 DateTime string
  registrationStartDate: string; // ISO 8601 DateTime string
  registrationEndDate: string;   // ISO 8601 DateTime string
  fees: string;                  // Exam fees (e.g., "25000 XAF")
  eligibility: string[];         // Array of eligibility criteria (e.g., ["Completed Form IV", "Birth Certificate"])
  subjects: string[];            // Array of subjects offered (e.g., ["Mathematics", "English Language"])
  venues: string[];              // Array of exam venues (e.g., ["Douala", "Yaounde"])
  documentUrl?: string;         // Optional URL to an official document/gazette
  resultDate?: string;          // Optional ISO 8601 DateTime string for result publication
  organizingBody: string;        // Name of the body organizing the exam (e.g., "Cameroon GCE Board")
  imageUrl?: string;            // Optional URL to an image representing the exam
  level: ExamLevel;              // Enum for the educational level
  createdAt: string;             // ISO 8601 DateTime string (auto-generated)
  updatedAt: string;             // ISO 8601 DateTime string (auto-generated)
}

export interface PaginatedExamsResponse {
  exams: Exam[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// -------------------
// 2. Scholarships
// -------------------

export interface Scholarship {
  id: string;             // Unique identifier (auto-generated)
  title: string;          // Title of the scholarship
  description: string;    // Detailed description
  provider: string;       // Organization providing the scholarship
  amount: string;         // Scholarship amount or benefits (e.g., "500,000 XAF per year", "Full tuition")
  deadline: string;       // ISO 8601 DateTime string for application deadline
  eligibility: string[];  // Array of eligibility criteria
  requirements: string[]; // Array of application requirements/documents
  applicationUrl: string; // URL to the application page or form
  type: string;           // Type of scholarship (e.g., "Undergraduate", "Postgraduate", "Research")
  country: string;        // Country where the scholarship is tenable (e.g., "Cameroon", "United Kingdom")
  imageUrl?: string;     // Optional URL to an image representing the scholarship
  lastUpdated: string;    // ISO 8601 DateTime string indicating when the scholarship info was last updated
  createdAt: string;      // ISO 8601 DateTime string (auto-generated)
  updatedAt: string;      // ISO 8601 DateTime string (auto-generated)
}

export interface PaginatedScholarshipsResponse {
  scholarships: Scholarship[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// -------------------
// 3. Guides
// -------------------

export interface GuideStep {
  id: string;          // Unique identifier (auto-generated)
  title: string;       // Title of the step
  description: string; // Detailed description of the step
  imageUrl?: string;  // Optional URL to an image for the step
  // guideId, createdAt, updatedAt are managed by the backend
}

export type GuideAudience = 'STUDENT' | 'PARENT' | 'GRADUATE' | 'ALL';

export interface Guide {
  id: string;            // Unique identifier (auto-generated)
  title: string;         // Title of the guide
  description: string;   // Short description of the guide
  category: string;      // Category of the guide (e.g., "Study Guides", "Career Guidance")
  audience: GuideAudience; // Enum for the target audience
  steps: GuideStep[];    // Array of guide steps
  lastUpdated: string;   // ISO 8601 DateTime string, when the guide content was last updated
  imageUrl?: string;    // Optional URL to a main image for the guide
  createdAt: string;     // ISO 8601 DateTime string (auto-generated)
  updatedAt: string;     // ISO 8601 DateTime string (auto-generated)
}

export interface PaginatedGuidesResponse {
  guides: Guide[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Generic API Error structure based on validation error examples
export interface ApiErrorDetail {
  path: string | (string | number)[]; // Path can be a string or an array for nested fields
  message: string;
}

export interface ApiErrorResponse {
  message: string;       // General error message (e.g., "Validation failed", "Not Found")
  errors?: ApiErrorDetail[]; // Optional array of specific errors, typically for 400 Bad Request
}
