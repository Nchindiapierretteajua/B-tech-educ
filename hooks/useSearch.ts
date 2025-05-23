import { useState, useCallback, useEffect } from 'react';
import { Exam, Scholarship, Guide } from '@/lib/types';
import { APP_CONSTANTS } from '@/lib/constants';
import { validateSearchQuery } from '@/lib/validation';
import { debounce } from '@/lib/utils';

interface SearchResult {
  exams: Exam[];
  scholarships: Scholarship[];
  guides: Guide[];
}

export function useSearch(
  exams: Exam[],
  scholarships: Scholarship[],
  guides: Guide[]
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({
    exams: [],
    scholarships: [],
    guides: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchItems = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults({ exams: [], scholarships: [], guides: [] });
        return;
      }

      const normalizedQuery = searchQuery.toLowerCase().trim();

      const filteredExams = exams.filter(
        (exam) =>
          exam.title.toLowerCase().includes(normalizedQuery) ||
          exam.description.toLowerCase().includes(normalizedQuery) ||
          exam.type.toLowerCase().includes(normalizedQuery)
      );

      const filteredScholarships = scholarships.filter(
        (scholarship) =>
          scholarship.title.toLowerCase().includes(normalizedQuery) ||
          scholarship.description.toLowerCase().includes(normalizedQuery) ||
          scholarship.type.toLowerCase().includes(normalizedQuery) ||
          scholarship.organization.toLowerCase().includes(normalizedQuery)
      );

      const filteredGuides = guides.filter(
        (guide) =>
          guide.title.toLowerCase().includes(normalizedQuery) ||
          guide.description.toLowerCase().includes(normalizedQuery) ||
          guide.category.toLowerCase().includes(normalizedQuery) ||
          guide.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );

      setResults({
        exams: filteredExams,
        scholarships: filteredScholarships,
        guides: filteredGuides,
      });
    },
    [exams, scholarships, guides]
  );

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      searchItems(searchQuery);
    }, APP_CONSTANTS.UI.DEBOUNCE_DELAY),
    [searchItems]
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      setError(null);

      const validationError = validateSearchQuery(searchQuery);
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);
      debouncedSearch(searchQuery);
    },
    [debouncedSearch]
  );

  useEffect(() => {
    setLoading(false);
  }, [results]);

  return {
    query,
    results,
    error,
    loading,
    handleSearch,
  };
}
