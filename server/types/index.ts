import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    total: number;
    pagesCount: number;
    currentPage: number;
    perPage: number;
    from: number;
    to: number;
    hasMore: boolean;
  };
};

export type SortDirection = 'asc' | 'desc';

export type QueryParamsType = Partial<{
  [key: string]: string | string[];
}>;

export type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
