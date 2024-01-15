import { getDepartments } from '@/app/actions/server/departments';
import { getOrganisations } from '@/app/actions/server/organisations';
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import React from 'react';

export default async function Page() {
  const breadcrumbItems = [
    { title: 'Пользователи', link: '/admin/users' },
    { title: 'Добавление пользователя', link: '/admin/users/new' }
  ];

  const departments = await getDepartments();
  const organisations = await getOrganisations();

  return (
    <div className='flex-1 space-y-4 p-8'>
      <BreadCrumb items={breadcrumbItems} />
      <UserForm
        organisations={organisations}
        departments={departments}
        // organisations={[
        //   { _id: 'organisation_1', name: 'Организация 1' },
        //   { _id: 'organisation_2', name: 'Организация 2' }
        // ]}
        // departments={[
        //   { _id: 'department_1', name: 'Отдел 1' },
        //   { _id: 'department_2', name: 'Отдел 2' }
        // ]}
        initialData={null}
        key={null}
      />
    </div>
  );
}
