'use client';

import { UserView } from '@/types/user';
import { Department, Organisation } from '@prisma/client';
import React, { createContext } from 'react';

type DataContextType = {
  users: UserView[];
  departments: Department[];
  organisations: Organisation[];
};

export const DataContext = createContext<DataContextType>({
  users: [],
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
