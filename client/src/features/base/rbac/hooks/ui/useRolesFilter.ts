import { useSearchParams } from 'react-router-dom';

export const useRolesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Get current values from URL
  const page       = Number(searchParams.get('page') || 1);
  const search     = searchParams.get('search')     || '';
  const group      = searchParams.get('group')      || '';
  const permission = searchParams.get('permission') || '';

  // 2. Multi-parameter setter
  const setFilters = (
    filters: Partial<{
      page:       number;
      search:     string;
      group:      string;
      permission: string;
    }>,
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      Object.entries(filters).forEach(([key, value]) => {
        if (value) next.set(key, String(value));
        else next.delete(key);
      });

      // Logical reset: if any filter besides page changes, go back to page 1
      if (Object.keys(filters).some((k) => k !== 'page')) {
        next.set('page', '1');
      }

      return next;
    });
  };

  return { page, search, group, permission, setFilters };
};
