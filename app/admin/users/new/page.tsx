import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
// import { getDepartmentsAction } from '@/app/actions/server/departments';
// import { getOrganisationsAction } from '@/app/actions/server/organisations';
import Header from '@/components/layout/header';

export const metadata = {
  title: 'Доб. пользователя'
};

const breadcrumbItems = [
  { title: 'Пользователи', link: '/admin/users' },
  { title: 'Добавление пользователя', link: '/admin/users/new' }
];

export default async function NewUserPage() {
  // const departments = await getDepartmentsAction();
  // const organisations = await getOrganisationsAction();

  return (
    <>
      <Header title='Добавление пользователя' />
      <main className='flex-1 space-y-4 px-8 pb-8'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='shadow-mod-1 rounded-md border p-4'>
          <UserForm
            // organisations={organisations}
            // departments={departments}
            initialData={null}
          />
        </div>
      </main>
    </>
  );
}
