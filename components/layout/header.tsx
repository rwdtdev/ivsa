import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { UserNav } from './user-nav';
import Link from 'next/link';

export default function Header() {
  return (
    <div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur'>
      <nav className='flex h-14 items-center justify-between px-4'>
        <div className='hidden md:block'>
          <Link href={'/admin'} target='_blank' className='flex'>
            <img src='/logo.png' alt='Логотип' className='h-8 w-8' />
            <h1 className='px-5 text-xl font-semibold'>Панель управления</h1>
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
