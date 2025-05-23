import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { Exam } from '@/types/exam';
import { Scholarship } from '@/types/scholarship';
import { Guide } from '@/types/guide';
import { usePreferences } from '../preferences';

export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { preferences } = usePreferences();

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.exams.fetch();
      setExams(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch exams'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return { exams, loading, error, refetch: fetchExams };
}

export function useScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { preferences } = usePreferences();

  const fetchScholarships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.scholarships.fetch();
      setScholarships(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch scholarships')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  return { scholarships, loading, error, refetch: fetchScholarships };
}

export function useGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { preferences } = usePreferences();

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.guides.fetch();
      setGuides(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch guides')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  return { guides, loading, error, refetch: fetchGuides };
}
