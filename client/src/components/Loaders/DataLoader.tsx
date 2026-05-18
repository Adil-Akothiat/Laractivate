import type { UseQueryResult } from '@tanstack/react-query';
import { ComponentLoader } from './Loaders';

interface DataLoaderProps<T> {
  query: UseQueryResult<T>; // <T> automatically detects the type from the hook
  children: (data: T) => React.ReactNode;
}

export function DataLoader<T>({ query, children }: DataLoaderProps<T>) {
  if (query.isPending) return <ComponentLoader isLoading={query.isPending} />;
  if (query.isError) return <div>Failed to fetch.</div>;
  if (!query.data) return null;

  return <>{children(query.data)}</>;
}