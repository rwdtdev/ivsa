'use client';
import Image from 'next/image';
import Link from 'next/link';
import { UserNav } from './user-nav';
import { DashboardNav } from '../dashboard-nav';
import { dictionaryItems } from '@/constants/data';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth-options';
import { UserRole } from '@prisma/client';
import { Separator } from '../ui/separator';
import { useSession } from 'next-auth/react';

// export default async function Header({ title }: { title: string }) {
export default function Header({ title }: { title: string }) {
  //// @ts-expect-error
  // const session = await getServerSession(authConfig);
  const session = useSession();
  console.log(session);
  const isAdmin = session?.data?.user.role === UserRole.ADMIN;
  // const isAdmin = true;

  return (
    <header className='supports-backdrop-blur:bg-background/60 sticky top-0 z-20 border-b bg-background/95 shadow-sm backdrop-blur'>
      <div className='flex h-14 items-center justify-between px-8'>
        <div className='mr-auto flex'>
          <Link href={'/'} className='flex'>
            <Image
              src='/logo.png'
              alt='Логотип'
              width={30}
              height={50}
              style={{ width: 'auto', height: 'auto' }}
            />
            <h1 className=' pl-4 text-xl font-semibold'>АСВИ</h1>
            {/* <h1 className='hidden pl-5 text-xl font-semibold lg:block'>
              Система видео-инвентаризаций
              АСВИ
            </h1> */}
          </Link>
          <div className='hidden lg:block'>
            <Separator orientation='vertical' className='mx-4' />
          </div>
          <h2 className=' hidden text-xl  font-semibold lg:block'>{title}</h2>
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
