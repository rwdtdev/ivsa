'use client';

import { PaginatedResponse } from '@/types';
import { UserView } from '@/types/user';
import { Department, Organisation } from '@prisma/client';
import React, { createContext } from 'react';

type DataContextType = {
  users: PaginatedResponse<UserView>;
  departments: Department[];
  organisations: Organisation[];
};

export const DataContext = createContext<DataContextType>({
  users: {
    items: [],
    pagination: {
      total: 0,
      pagesCount: 0,
      currentPage: 0,
      perPage: 0,
      from: 0,
      to: 0,
      hasMore: false
    }
  },
  departments: [],
  organisations: []
});

export default function DataProvider({
  children,
  data
}: {
  children: React.ReactNode;
  data: any;
}) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
