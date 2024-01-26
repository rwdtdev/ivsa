import { getDepartments } from '@/app/actions/server/departments';
import { getOrganisations } from '@/app/actions/server/organisations';
import Header from '@/components/layout/header';
import DataProvider from '@/providers/DataProvider';
import { getUsers } from '@/server/services/users';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ASVI Пользователи',
  description: 'Справочник пользователей системы ASVI'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  const departments = await getDepartments();
  const organisations = await getOrganisations();

  return (
    <>
      <Header />
      <div className='flex h-screen overflow-hidden'>
        <DataProvider
          data={{
            users: users,
            departments,
            organisations
          }}
        >
          <main className='w-full pt-16'>{children}</main>
        </DataProvider>
      </div>
    </>
  );
}
