# PubCam Student Guide - Application Description

## Overview

PubCam Student Guide is a comprehensive mobile application designed to help students in Cameroon navigate various educational services, including exams, scholarships, and guides. The application provides a centralized platform for accessing educational information and managing personal preferences.

## Core Features

### 1. Exams Management

- Display of various educational exams (GCE O/L, GCE A/L, BACC, etc.)
- Exam details including:
  - Registration dates
  - Exam dates
  - Fees
  - Eligibility criteria
  - Subjects
  - Venues
  - Result dates
  - Organizing bodies

### 2. Scholarships

- Comprehensive scholarship listings
- Details include:
  - Provider information
  - Amount
  - Deadlines
  - Eligibility requirements
  - Application process
  - Types (undergraduate, postgraduate, research)

### 3. Educational Guides

- Step-by-step guides for various educational processes
- Categories:
  - Study guides
  - Career guidance
  - Life skills
- Each guide includes:
  - Detailed steps
  - Target audience
  - Reading time
  - Last updated date

### 4. Bookmarking System

- Save items for quick access
- Categorization by type (exam, scholarship, guide)
- Persistent storage
- Real-time bookmark status updates

### 5. User Preferences

- Dark mode support
- Notification settings
- Offline mode capability

## Data Models

### 1. Exam

```typescript
interface Exam {
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
```

### 2. Scholarship

```typescript
interface Scholarship {
  id: string;
  title: string;
  description: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  requirements: string[];
  applicationUrl: string;
  type: string;
  country: string;
  imageUrl?: string;
  lastUpdated: string;
}
```

### 3. Guide

```typescript
interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  audience: 'student' | 'parent' | 'graduate' | 'all';
  steps: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  lastUpdated: string;
  imageUrl?: string;
}
```

### 4. Bookmark

```typescript
interface Bookmark {
  id: string;
  type: 'exam' | 'scholarship' | 'guide';
  itemId: string;
  createdAt: string;
}
```

### 5. Preferences

```typescript
interface Preferences {
  notifications: boolean;
  darkMode: boolean;
  offlineMode: boolean;
}
```

## Application Workflow

### 1. Data Flow

- Initial data loading from backend API
- Local caching for offline access
- Real-time updates for critical information
- Periodic data synchronization

### 2. User Interactions

- Browse and search functionality
- Filtering by categories and dates
- Bookmark management
- Preference updates
- Guide navigation

### 3. State Management

- Redux for global state
- Local storage for persistence
- Async storage for preferences
- Cache management for offline support

## API Requirements

### 2. Data Endpoints

- Exams CRUD operations
- Scholarships CRUD operations
- Guides CRUD operations
- Bookmark management
- User preferences

### 3. Search and Filter

- Full-text search
- Category-based filtering
- Date range filtering
- Pagination support

## Development Guidelines

### 1. Code Structure

- Modular architecture
- Clear separation of concerns
- Consistent coding standards
- Comprehensive documentation
