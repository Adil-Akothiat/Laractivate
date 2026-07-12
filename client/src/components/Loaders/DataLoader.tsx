import type { UseQueryResult } from '@tanstack/react-query';
import { ComponentLoader } from './Loaders';
import type { ReactNode } from 'react';
import { Alert, type AlertVariant } from '../Alert';
import { getErrorsMessagesStr } from '@/app/utils';

interface DataLoaderProps<T> {
  query: UseQueryResult<T>; // <T> automatically detects the type from the hook
  children: (data: T) => ReactNode;
  fallback?: ReactNode;
  fallbackVariant?: AlertVariant;
}

export function DataLoader<T>({ query, children, fallback, fallbackVariant="error" }: DataLoaderProps<T>) {
  if (query.isPending) return <ComponentLoader isLoading={query.isPending} />;
  if (query.isError) {
    if(fallback) return fallback;
    return <Alert variant={fallbackVariant} className='alert-outline' message={getErrorsMessagesStr(query.error)} />
  }
  if (!query.data) return null;

  return <>{children(query.data)}</>;
}