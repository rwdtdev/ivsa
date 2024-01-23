'use client';

import React, { useContext } from 'react';
import { DataContext } from '@/providers/DataProvider';
import { UserForm } from '@/components/forms/user-form';
import BreadCrumb from '@/components/breadcrumb';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Пользователи', link: '/admin/users' },
    { title: 'Добавление пользователя', link: '/admin/users/new' }
  ];

  const { departments, organisations } = useContext(DataContext);

  return (
    <div className='flex-1 space-y-4 p-8'>
      <BreadCrumb items={breadcrumbItems} />
      <UserForm
        organisations={organisations}
        departments={departments}
        initialData={null}
      />
    </div>
  );
}
