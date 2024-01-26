import Header from '@/components/layout/header';
import DataProvider from '@/providers/DataProvider';
import { getUsers } from '@/server/services/users';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ASVI Пользователи',
  description: 'Справочник пользователей системы ASVI'
};

export default async function EventsLayout({ children }: { children: React.ReactNode }) {
  const users = await getUsers();

  return (
    <>
      <Header />
      <div className='flex h-screen overflow-hidden'>
        <DataProvider data={{ users: users.items }}>
          <main className='w-full pt-16'>{children}</main>
        </DataProvider>
      </div>
    </>
  );
}
