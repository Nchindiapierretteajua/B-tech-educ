/* eslint-disable prettier/prettier */
import Constants from 'expo-constants';
import { PaginatedExamsResponse, ApiErrorResponse, Exam, Scholarship, PaginatedScholarshipsResponse, Guide, PaginatedGuidesResponse } from '@/types/api'; // Assuming types are in @/types/api

const API_BASE_URL_FROM_ENV = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

if (!API_BASE_URL_FROM_ENV) {
  console.error('ERROR: EXPO_PUBLIC_API_URL is not set in .env or app.json/app.config.js extras.');
  // You might want to throw an error here or provide a default fallback for development,
  // but for now, we'll log an error and proceed, which will likely cause API calls to fail.
}

const API_URL = `${API_BASE_URL_FROM_ENV || 'http://localhost:3000'}/api`;

/**
 * Generic fetch wrapper for API calls
 * @param endpoint The API endpoint (e.g., '/exams')
 * @param options Fetch options (method, headers, body, etc.)
 * @returns Promise<T> The parsed JSON response
 * @throws ApiErrorResponse if the response is not ok
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // Add any other default headers, like Authorization tokens, if needed
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorData: ApiErrorResponse;
      try {
        errorData = await response.json();
      } catch (e) {
        // If parsing error JSON fails, create a generic error
        errorData = {
          message: `HTTP error! status: ${response.status} - ${response.statusText}`,
        };
      }
      console.error('API Error:', errorData);
      throw errorData; // Throw the structured error
    }

    // Handle cases where response might be empty (e.g., 204 No Content for DELETE)
    if (response.status === 204) {
      return {} as T; // Or undefined, depending on how you want to handle it
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Fetch API error for endpoint ${endpoint}:`, error);
    // Ensure the thrown error is always in ApiErrorResponse format if possible
    if (error instanceof Error && !(error as ApiErrorResponse).message) {
        throw { message: error.message } as ApiErrorResponse;
    }
    throw error; // Re-throw the error (could be ApiErrorResponse or other network error)
  }
}

// --- Exams API --- //

interface GetExamsParams {
  q?: string;
  level?: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  startDateBefore?: string;
  startDateAfter?: string;
  endDateBefore?: string;
  endDateAfter?: string;
  registrationStartDateBefore?: string;
  registrationStartDateAfter?: string;
  registrationEndDateBefore?: string;
  registrationEndDateAfter?: string;
  resultDateBefore?: string;
  resultDateAfter?: string;
  page?: number;
  limit?: number;
}

export const getExams = (params?: GetExamsParams): Promise<PaginatedExamsResponse> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  return fetchApi<PaginatedExamsResponse>(`/exams?${queryParams.toString()}`);
};

export const getExamById = (id: string): Promise<Exam> => {
  return fetchApi<Exam>(`/exams/${id}`);
};

// POST, PUT, DELETE for Exams would go here
// Example for POST (body type would be Omit<Exam, 'id' | 'createdAt' | 'updatedAt'> or similar)
// export const createExam = (examData: Partial<Exam>): Promise<Exam> => {
//   return fetchApi<Exam>('/exams', { method: 'POST', body: JSON.stringify(examData) });
// };

// --- Scholarships API --- //

interface GetScholarshipsParams {
  q?: string;
  type?: string;
  country?: string;
  deadlineBefore?: string;
  deadlineAfter?: string;
  page?: number;
  limit?: number;
}

export const getScholarships = (params?: GetScholarshipsParams): Promise<PaginatedScholarshipsResponse> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  return fetchApi<PaginatedScholarshipsResponse>(`/scholarships?${queryParams.toString()}`);
};

export const getScholarshipById = (id: string): Promise<Scholarship> => {
  return fetchApi<Scholarship>(`/scholarships/${id}`);
};

// --- Guides API --- //

interface GetGuidesParams {
  q?: string;
  category?: string;
  audience?: 'STUDENT' | 'PARENT' | 'GRADUATE' | 'ALL';
  page?: number;
  limit?: number;
}

export const getGuides = (params?: GetGuidesParams): Promise<PaginatedGuidesResponse> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  return fetchApi<PaginatedGuidesResponse>(`/guides?${queryParams.toString()}`);
};

export const getGuideById = (id: string): Promise<Guide> => {
  return fetchApi<Guide>(`/guides/${id}`);
};

export default {
  getExams,
  getExamById,
  getScholarships,
  getScholarshipById,
  getGuides,
  getGuideById,
  // ... other methods when added
};
