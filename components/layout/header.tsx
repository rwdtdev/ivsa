'use client';
import Image from 'next/image';
import Link from 'next/link';
import { UserNav } from './user-nav';
import { DashboardNav } from '../dashboard-nav';
import { dictionaryItems } from '@/constants/data';
import { UserRole } from '@prisma/client';
import { Separator } from '../ui/separator';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Header({ title }: { title: string }) {
  const session = useSession();
  const isAdmin = session?.data?.user.role === UserRole.ADMIN;
  const pathname = usePathname();

  return (
    <header className='supports-backdrop-blur:bg-background/60 sticky top-0 z-20 border-b bg-slate-50 shadow-sm backdrop-blur'>
      <div className='flex h-14 items-center justify-between px-3 sm:px-8'>
        <div className='mr-auto flex'>
          <Link href={'/'} className='flex min-w-32'>
            <Image
              // src='/logo.png'
              src='/logorzd.svg'
              alt='Логотип'
              width={30}
              height={50}
              style={{ width: '50px', height: '30px' }}
            />
            {pathname === '/login' ? (
              <h1 className='pl-4 text-xl font-semibold'>
                АС{'\u00A0'}видеоинвентаризации
              </h1>
            ) : (
              <h1 className='pl-4 text-xl font-semibold'>АС{'\u00A0'}ВИ</h1>
            )}
          </Link>
          <div className='hidden lg:block'>
            <Separator orientation='vertical' className='mx-4' />
          </div>
          <h2 className='hidden text-xl font-semibold lg:block'>{title}</h2>
        </div>
        {isAdmin && <DashboardNav items={dictionaryItems} />}
        {session && (
          <div className='flex items-center gap-2'>
            <UserNav />
          </div>
        )}
      </div>
    </header>
  );
}
