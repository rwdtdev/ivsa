import _ from 'underscore';
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { getUserByIdAction } from '@/app/actions/server/users';
import Header from '@/components/layout/header';
import { getOrganisationsAction } from '@/app/actions/server/organisations';
import { getDepartmentsAction } from '@/app/actions/server/departments';

export default async function UpdateUserPage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const user = await getUserByIdAction(userId);
  console.log('🚀 ~ UpdateUserPage ~ user:', user);
  const organisations = await getOrganisationsAction();
  const departments = await getDepartmentsAction();

  if (!user) {
    return <div>нет такого пользователя</div>;
  }
  const omitKeys = ['password', 'passwordHashes'];

  if (user.departmentId === null) omitKeys.push('departmentId');
  if (user.organisationId === null) omitKeys.push('organisationId');

  const userInitialData = _.omit(user, omitKeys);
  console.log('🚀 ~ UpdateUserPage ~ userInitialData:', userInitialData);

  const breadcrumbItems = [
    { title: 'Пользователи', link: '/admin/users' },
    { title: 'Редактирование пользователя', link: `/admin/users/${userId}` }
  ];

  return (
    <>
      <Header title='Редактирование&nbsp;пользователя' />
      <main className='flex-1 space-y-4 px-8 pb-8'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='rounded-md border p-4 shadow-mod-1'>
          <UserForm
            userId={userId}
            initialData={userInitialData}
            organisations={organisations}
            departments={departments}
          />
        </div>
      </main>
    </>
  );
}
