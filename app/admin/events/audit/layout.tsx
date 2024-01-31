import { ReactChildren } from '@/app/types';
import Header from '@/components/layout/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ASVI Пользователи',
  description: 'Справочник пользователей системы ASVI'
};

export default async function AuditEventsLayout({ children }: ReactChildren) {
  return (
    <>
      <Header />
      <div className='flex h-screen overflow-hidden'>
        <main className='w-full pt-16'>{children}</main>
      </div>
    </>
  );
}
