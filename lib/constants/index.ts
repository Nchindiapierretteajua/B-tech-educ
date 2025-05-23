export const APP_CONSTANTS = {
  CACHE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  STORAGE_KEYS: {
    PREFERENCES: '@app_preferences',
    EXAMS_CACHE: '@cache_exams',
    SCHOLARSHIPS_CACHE: '@cache_scholarships',
    GUIDES_CACHE: '@cache_guides',
    BOOKMARKS: '@app_bookmarks',
  },
  API: {
    BASE_URL: 'https://api.example.com', // TODO: Replace with actual API URL
    TIMEOUT: 10000, // 10 seconds
  },
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    MAX_SEARCH_LENGTH: 100,
    MAX_TITLE_LENGTH: 50,
    MAX_DESCRIPTION_LENGTH: 200,
  },
  FILTERS: {
    DEFAULT_DATE_RANGE: {
      start: new Date(),
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    CATEGORIES: {
      EXAMS: ['All', 'Academic', 'Professional', 'Entrance'],
      SCHOLARSHIPS: ['All', 'Merit', 'Need', 'Sports', 'Research'],
      GUIDES: ['All', 'Study', 'Career', 'Life Skills'],
    },
  },
} as const;

export const THEME = {
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F2F2F7',
    TEXT: '#000000',
    TEXT_SECONDARY: '#8E8E93',
    BORDER: '#C6C6C8',
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  TYPOGRAPHY: {
    FONT_FAMILY: {
      REGULAR: 'System',
      MEDIUM: 'System-Medium',
      BOLD: 'System-Bold',
    },
    FONT_SIZE: {
      XS: 12,
      SM: 14,
      MD: 16,
      LG: 18,
      XL: 20,
      XXL: 24,
    },
  },
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
  },
} as const;
