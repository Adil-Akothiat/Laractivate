// api
export interface ApiResponseSchema<T> {
  data: T;
  message?: string;
}

export interface PaginationMetaSchema {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

/**
 * Standard Laravel Pagination Links
*/
export interface PaginationLinksSchema {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponseSchema<T> {
  data: T[];
  links: PaginationLinksSchema,
  meta: PaginationMetaSchema
}

export interface ResourceSchema<T> {
  data: T;
  message?: string; // Useful for success messages from the server
  meta?: Record<string, any>; // For extra context like permissions
}

export interface PasswordSchema {
  password:string;
  password_confirmation:string;
}

// Props
export type SetStateProps<T> = React.Dispatch<React.SetStateAction<T>>;

// PaginationParams
export interface PaginationParams {
    search?: string;
    page?: number;
}