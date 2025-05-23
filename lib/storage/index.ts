import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../constants';
import { Bookmark } from '../types';

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Failed to get item ${key}:`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set item ${key}:`, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item ${key}:`, error);
  }
}

export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const bookmarks = await getItem<Bookmark[]>(
    APP_CONSTANTS.STORAGE_KEYS.BOOKMARKS
  );
  return bookmarks || [];
}

export async function addBookmark(bookmark: Bookmark): Promise<void> {
  const bookmarks = await getBookmarks();
  await setItem(APP_CONSTANTS.STORAGE_KEYS.BOOKMARKS, [...bookmarks, bookmark]);
}

export async function removeBookmark(bookmarkId: string): Promise<void> {
  const bookmarks = await getBookmarks();
  const updatedBookmarks = bookmarks.filter((b) => b.id !== bookmarkId);
  await setItem(APP_CONSTANTS.STORAGE_KEYS.BOOKMARKS, updatedBookmarks);
}

export async function isBookmarked(
  itemId: string,
  type: Bookmark['type']
): Promise<boolean> {
  const bookmarks = await getBookmarks();
  return bookmarks.some((b) => b.itemId === itemId && b.type === type);
}

export async function getBookmark(
  itemId: string,
  type: Bookmark['type']
): Promise<Bookmark | null> {
  const bookmarks = await getBookmarks();
  return bookmarks.find((b) => b.itemId === itemId && b.type === type) || null;
}
