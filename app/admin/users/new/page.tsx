import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { getDepartmentsAction } from '@/app/actions/server/departments';
import { getOrganisationsAction } from '@/app/actions/server/organisations';

const breadcrumbItems = [
  { title: 'Пользователи', link: '/admin/users' },
  { title: 'Добавление пользователя', link: '/admin/users/new' }
];

export default async function NewUserPage() {
  const departments = await getDepartmentsAction();
  const organisations = await getOrganisationsAction();

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
