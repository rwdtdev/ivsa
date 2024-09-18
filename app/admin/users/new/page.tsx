import { getDepartmentsAction } from '@/app/actions/server/departments';
import { getOrganisationsAction } from '@/app/actions/server/organisations';
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';

import Header from '@/components/layout/header';
import { generatePasswordAsync } from '@/utils/password-generator';

export const metadata = {
  title: 'Доб. пользователя'
};

const breadcrumbItems = [
  { title: 'Пользователи', link: '/admin/users' },
  { title: 'Добавление пользователя', link: '/admin/users/new' }
];

export default async function NewUserPage() {
  const organisations = await getOrganisationsAction();
  const departments = await getDepartmentsAction();
  const generatedPassword = await generatePasswordAsync();

  return (
    <>
      <Header title='Добавление пользователя' />
      <main className='flex-1 space-y-4 px-8 pb-8'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='rounded-md border p-4 shadow-mod-1'>
          <UserForm
            initialData={undefined}
            organisations={organisations}
            departments={departments}
            generatedPassword={generatedPassword}
          />
        </div>
      </main>
    </>
  );
}
