import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
// import { getDepartmentsAction } from '@/app/actions/server/departments';
// import { getOrganisationsAction } from '@/app/actions/server/organisations';
import Header from '@/components/layout/header';
import { authConfig } from '@/lib/auth-options';
import { getClientIP } from '@/lib/helpers/ip';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';

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
  const session = await getServerSession(authConfig);
  const headersList = headers();
  const ip = getClientIP(headersList);

  const monitoringData = {
    ip: ip || 'нет данных',
    initiator: session?.user.name || 'нет данных',
    details: {
      adminUsername: session?.user.name || 'нет данных'
      // editedUserUsername: user.username,
      // editedUserName: user.name
    }
  };

  return (
    <>
      <Header title='Добавление пользователя' />
      <main className='flex-1 space-y-4 px-8 pb-8'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='rounded-md border p-4 shadow-mod-1'>
          <UserForm
            // organisations={organisations}
            // departments={departments}
            initialData={null}
            monitoringData={monitoringData}
          />
        </div>
      </main>
    </>
  );
}
