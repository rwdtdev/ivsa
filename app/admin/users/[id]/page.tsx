'use client';

import _ from 'underscore';
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserByIdAction } from '@/app/actions/server/users';
import { getOrganisationsAction } from '@/app/actions/server/organisations';
import { getDepartmentsAction } from '@/app/actions/server/departments';
import { Department, Organisation } from '@prisma/client';

export default function UpdateUserPage() {
  const pathname = usePathname();

  const [userInitialData, setUserInitialData] = useState({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);

  const pathnameChunks = pathname.split('/');
  const userId = pathnameChunks[pathnameChunks.length - 1].trim();

  const setInitialState = async () => {
    const user = await getUserByIdAction(userId);

    if (user) {
      const listOfDepartments = await getDepartmentsAction();
      const listOfORganisations = await getOrganisationsAction();

      setUserInitialData(user);
      setDepartments(listOfDepartments);
      setOrganisations(listOfORganisations);
    }
  };

  useEffect(() => {
    setInitialState();
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
