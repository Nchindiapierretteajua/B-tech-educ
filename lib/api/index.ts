import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exam } from '@/types/exam';
import { Scholarship } from '@/types/scholarship';
import { Guide } from '@/types/guide';
import { mockExams } from '@/data/mockExams';
import { mockScholarships } from '@/data/mockScholarships';
import { mockGuides } from '@/data/mockGuides';
import { APP_CONSTANTS } from '../constants';

interface CacheData<T> {
  data: T[];
  timestamp: number;
}

async function getCachedData<T>(key: string): Promise<T[] | null> {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CacheData<T> = JSON.parse(cached);
    if (Date.now() - timestamp > APP_CONSTANTS.CACHE_EXPIRY) return null;

    return data;
  } catch (error) {
    console.error(`Failed to get cached data for ${key}:`, error);
    return null;
  }
}

async function setCachedData<T>(key: string, data: T[]): Promise<void> {
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`Failed to cache data for ${key}:`, error);
  }
}

export const api = {
  exams: {
    async fetch(): Promise<Exam[]> {
      try {
        // Try to get from cache first
        const cached = await getCachedData<Exam>(
          APP_CONSTANTS.STORAGE_KEYS.EXAMS_CACHE
        );
        if (cached) return cached;

        // TODO: Replace with actual API call
        const data = mockExams;
        await setCachedData(APP_CONSTANTS.STORAGE_KEYS.EXAMS_CACHE, data);
        return data;
      } catch (error) {
        console.error('Failed to fetch exams:', error);
        // Try to use cache even if expired
        const cached = await getCachedData<Exam>(
          APP_CONSTANTS.STORAGE_KEYS.EXAMS_CACHE
        );
        if (cached) return cached;
        throw new Error('Failed to fetch exams');
      }
    },
  },

  scholarships: {
    async fetch(): Promise<Scholarship[]> {
      try {
        const cached = await getCachedData<Scholarship>(
          APP_CONSTANTS.STORAGE_KEYS.SCHOLARSHIPS_CACHE
        );
        if (cached) return cached;

        // TODO: Replace with actual API call
        const data = mockScholarships;
        await setCachedData(
          APP_CONSTANTS.STORAGE_KEYS.SCHOLARSHIPS_CACHE,
          data
        );
        return data;
      } catch (error) {
        console.error('Failed to fetch scholarships:', error);
        const cached = await getCachedData<Scholarship>(
          APP_CONSTANTS.STORAGE_KEYS.SCHOLARSHIPS_CACHE
        );
        if (cached) return cached;
        throw new Error('Failed to fetch scholarships');
      }
    },
  },

  guides: {
    async fetch(): Promise<Guide[]> {
      try {
        const cached = await getCachedData<Guide>(
          APP_CONSTANTS.STORAGE_KEYS.GUIDES_CACHE
        );
        if (cached) return cached;

        // TODO: Replace with actual API call
        const data = mockGuides;
        await setCachedData(APP_CONSTANTS.STORAGE_KEYS.GUIDES_CACHE, data);
        return data;
      } catch (error) {
        console.error('Failed to fetch guides:', error);
        const cached = await getCachedData<Guide>(
          APP_CONSTANTS.STORAGE_KEYS.GUIDES_CACHE
        );
        if (cached) return cached;
        throw new Error('Failed to fetch guides');
      }
    },
  },
};
