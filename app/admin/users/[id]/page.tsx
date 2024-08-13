// 'use client';

import _ from 'underscore';
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
// import { usePathname } from 'next/navigation';
// import { useEffect, useState } from 'react';
import { getUserByIdAction } from '@/app/actions/server/users';
// import { getOrganisationsAction } from '@/app/actions/server/organisations';
// import { getDepartmentsAction } from '@/app/actions/server/departments';
// import { Department, Organisation } from '@prisma/client';
// import { UserView } from '@/types/user';
// import Loading from '@/app/loading';
import Header from '@/components/layout/header';
import { getClientIP } from '@/lib/helpers/ip';
import { headers } from 'next/headers';

export default async function UpdateUserPage({ params }: { params: { id: string } }) {
  // console.log('🚀 ~ UpdateUserPage ~ session:', session);
  const headersList = headers();
  const ip = getClientIP(headersList);
  console.log('🚀 ~ UpdateUserPage ~ ip2:', ip);
  // const ip = getClientIP(req.headers);
  // const pathname = usePathname();

  // const [userInitialData, setUserInitialData] = useState<Partial<UserView>>();

  // const pathnameChunks = pathname.split('/');
  // const userId = pathnameChunks[pathnameChunks.length - 1].trim();

  // const setInitialState = async () => {
  const userId = params.id;
  const user = await getUserByIdAction(userId);

  if (!user) {
    return <div>нет такого пользователя</div>;
  }
  const omitKeys = ['password'];

  // Hack for ShadCN forms, can't be pass default value as null only string or undefined (Have not resolved issue on git)
  if (user.departmentId === null) omitKeys.push('departmentId');
  if (user.organisationId === null) omitKeys.push('organisationId');

  const userInitialData = _.omit(user, omitKeys);
  // };

  // useEffect(() => {
  //   setInitialState();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   document.title = 'Ред. пользователя';
  // }, []);

  // if (!userInitialData) {
  //   return <Loading />;
  // }

  const breadcrumbItems = [
    { title: 'Пользователи', link: '/admin/users' },
    { title: 'Редактирование пользователя', link: `/admin/users/${userId}` }
  ];

  return (
    <>
      <Header title='Редактирование пользователя' />
      <main className='flex-1 space-y-4 px-8 pb-8'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='rounded-md border p-4 shadow-mod-1'>
          <UserForm
            userId={userId}
            // organisations={organisations}
            // departments={departments}
            initialData={userInitialData}
          />
        </div>
      </main>
    </>
  );
}
