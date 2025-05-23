import { NavigatorScreenParams } from '@react-navigation/native';
import { Exam, Scholarship, Guide } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  ExamDetails: { exam: Exam };
  ScholarshipDetails: { scholarship: Scholarship };
  GuideDetails: { guide: Guide };
  Bookmarks: undefined;
  Search: undefined;
};

export type TabParamList = {
  Exams: undefined;
  Scholarships: undefined;
  Guides: undefined;
  Profile: undefined;
};

export type RootTabParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  Bookmarks: undefined;
  Search: undefined;
};

export const ROUTES = {
  HOME: 'Home',
  SETTINGS: 'Settings',
  EXAM_DETAILS: 'ExamDetails',
  SCHOLARSHIP_DETAILS: 'ScholarshipDetails',
  GUIDE_DETAILS: 'GuideDetails',
  BOOKMARKS: 'Bookmarks',
  SEARCH: 'Search',
  EXAMS: 'Exams',
  SCHOLARSHIPS: 'Scholarships',
  GUIDES: 'Guides',
  PROFILE: 'Profile',
  MAIN: 'Main',
} as const;

export const TAB_ICONS = {
  [ROUTES.EXAMS]: 'school',
  [ROUTES.SCHOLARSHIPS]: 'card-giftcard',
  [ROUTES.GUIDES]: 'menu-book',
  [ROUTES.PROFILE]: 'person',
} as const;

export const TAB_LABELS = {
  [ROUTES.EXAMS]: 'Exams',
  [ROUTES.SCHOLARSHIPS]: 'Scholarships',
  [ROUTES.GUIDES]: 'Guides',
  [ROUTES.PROFILE]: 'Profile',
} as const;
