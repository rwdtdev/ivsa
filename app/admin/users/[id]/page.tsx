import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { usePathname } from 'next/navigation';
import React from 'react';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { UserService } from '@/server/services/users';

export default async function Page() {
  const data = await getServerSession();

  const userService = new UserService();

  const currentUser = await userService.getUserBy({
    name: data.name,
    email: data.email
  });

  //   const pathname = usePathname();

  //   const splitted = pathname.split('/');
  //   const userId = splitted[splitted.length - 1];

  //   const headersList = headers();
  //   const url = headersList.get('x-url') || '';

  //   const splitted = url.split('/');
  const userId = '';

  //   console.log(url);

  const breadcrumbItems = [
    { title: 'Пользователи', link: '/admin/users' },
    { title: 'Редактирование пользователя', link: `/admin/users/${userId}` }
  ];

  return (
    <div className='flex-1 space-y-4 p-8'>
      <BreadCrumb items={breadcrumbItems} />
      <UserForm
        organisations={[
          { _id: 'organisation_1', name: 'Организация 1' },
          { _id: 'organisation_2', name: 'Организация 2' }
        ]}
        departments={[
          { _id: 'department_1', name: 'Отдел 1' },
          { _id: 'department_2', name: 'Отдел 2' }
        ]}
        initialData={null}
        key={null}
      />
    </div>
  );
}
