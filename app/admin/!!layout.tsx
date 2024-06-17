import type { Metadata } from 'next';
import { ReactChildren } from '../types';
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Администрирование',
  description: 'Панель управления'
};

export default function AdminLayout({ children }: ReactChildren) {
  return (
    <>
      <div className='flex h-full overflow-hidden'>
        <main className='w-full'>{children}</main>
      </div>
    </>
  );
}
