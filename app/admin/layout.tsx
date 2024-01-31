import type { Metadata } from 'next';
import { ReactChildren } from '../types';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

export const metadata: Metadata = {
  title: 'ASVI Администрирование',
  description: 'Панель управления'
};

export default function AdminLayout({ children }: ReactChildren) {
  return (
    <>
      <Header />
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <main className='w-full pt-16'>{children}</main>
      </div>
    </>
  );
}
