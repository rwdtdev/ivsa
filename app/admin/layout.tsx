'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  //   <button style={{ padding: '5px' }} onClick={() => signOut()}>
  //   Logout
  // </button>

  return (
    <></>

    // <section>
    //   <div className='flex h-screen bg-gray-200 dark:bg-gray-900'>
    //     <aside className='w-64 bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-700'>
    //       <div className='flex h-16 items-center justify-center border-b-2'>
    //         <h2 className='text-1xl font-semibold text-gray-800 dark:text-white'>
    //           ASVI Admin
    //         </h2>
    //       </div>

    //       <ul>
    //         <li className='flex items-center p-6 hover:bg-gray-100 dark:hover:bg-gray-700'>
    //           <Link className='flex items-center space-x-4' href='/admin'>
    //             <HomeIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
    //             <span className='text-sm font-medium'>Дэшборд</span>
    //           </Link>
    //         </li>
    //         <li className='flex items-center p-6 hover:bg-gray-100 dark:hover:bg-gray-700'>
    //           <Link className='flex items-center space-x-4' href='/admin/users'>
    //             <UsersIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
    //             <span className='text-sm font-medium'>Пользователи</span>
    //           </Link>
    //         </li>
    //       </ul>
    //     </aside>
    //     <main className='flex-1 p-6'>{children}</main>
    //   </div>
    // </section>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
      <polyline points='9 22 9 12 15 12 15 22' />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  );
}
