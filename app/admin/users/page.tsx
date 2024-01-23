'use client';

import BreadCrumb from '@/components/breadcrumb';

import { UsersTable } from '@/components/tables/user-tables/table';
import { useContext } from 'react';
import { DataContext } from '@/providers/DataProvider';

const breadcrumbItems = [{ title: 'Пользователи', link: '/admin/users' }];

export default async function page() {
  const { users, departments, organisations } = useContext(DataContext);

  const formattedUsers = users.map(({ organisationId, departmentId, ...user }) => {
    const department = departments.find(({ id }) => id === departmentId);
    const organisation = organisations.find(({ id }) => id === organisationId);

    return {
      ...user,
      departmentName: department?.name,
      organisationName: organisation?.name
    };
  });

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <BreadCrumb items={breadcrumbItems} />
      <UsersTable data={formattedUsers} />
    </div>
  );
}
