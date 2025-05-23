import { APP_CONSTANTS } from '../constants';
import { DateRange, FilterState } from '../types';

export function validateSearchQuery(query: string): string | null {
  if (!query) return null;
  if (query.length > APP_CONSTANTS.UI.MAX_SEARCH_LENGTH) {
    return `Search query must be less than ${APP_CONSTANTS.UI.MAX_SEARCH_LENGTH} characters`;
  }
  return null;
}

export function validateTitle(title: string): string | null {
  if (!title) return 'Title is required';
  if (title.length > APP_CONSTANTS.UI.MAX_TITLE_LENGTH) {
    return `Title must be less than ${APP_CONSTANTS.UI.MAX_TITLE_LENGTH} characters`;
  }
  return null;
}

export function validateDescription(description: string): string | null {
  if (!description) return 'Description is required';
  if (description.length > APP_CONSTANTS.UI.MAX_DESCRIPTION_LENGTH) {
    return `Description must be less than ${APP_CONSTANTS.UI.MAX_DESCRIPTION_LENGTH} characters`;
  }
  return null;
}

export function validateDateRange(dateRange: DateRange): string | null {
  if (!dateRange.start || !dateRange.end) {
    return 'Start and end dates are required';
  }
  if (dateRange.start > dateRange.end) {
    return 'Start date must be before end date';
  }
  return null;
}

export function validateFilterState(filterState: FilterState): string | null {
  if (filterState.search) {
    const searchError = validateSearchQuery(filterState.search);
    if (searchError) return searchError;
  }

  if (filterState.dateRange) {
    const dateRangeError = validateDateRange(filterState.dateRange);
    if (dateRangeError) return dateRangeError;
  }

  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
}

export function validatePhoneNumber(phone: string): string | null {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return 'Invalid phone number format';
  }
  return null;
}
