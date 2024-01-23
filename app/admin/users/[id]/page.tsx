'use client';

import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useOptimistic, useState, useTransition } from 'react';
import { UserService } from '@/server/services/users';
import { DataContext } from '@/providers/DataProvider';
import { getUserByIdAction } from '@/app/actions/server/users';

export default function Page() {
  const { departments, organisations } = useContext(DataContext);
  const pathname = usePathname();

  const [userInitialData, setUserInitialData] = useState({});

  const pathnameChunks = pathname.split('/');
  const userId = pathnameChunks[pathnameChunks.length - 1].trim();

  const getSelectedUser = async () => {
    const user = await getUserByIdAction(userId);

    if (user) {
      setUserInitialData(user);
    }
  };

  useEffect(() => {
    getSelectedUser();
  }, []);

  const breadcrumbItems = [
    { title: 'Пользователи', link: '/admin/users' },
    { title: 'Редактирование пользователя', link: `/admin/users/${userId}` }
  ];

  return (
    <div className='flex-1 space-y-4 p-8'>
      <BreadCrumb items={breadcrumbItems} />
      <UserForm
        organisations={organisations}
        departments={departments}
        initialData={userInitialData}
      />
    </div>
  );
}
