import BreadCrumb from '@/components/breadcrumb';

import { getUsers } from '@/server/services/users';
import { UsersTable } from '@/components/tables/user-tables/table';
import { getDepartments } from '@/app/actions/server/departments';
import { getOrganisations } from '@/app/actions/server/organisations';

const breadcrumbItems = [{ title: 'Пользователи', link: '/admin/users' }];

export default async function page() {
  const users = await getUsers();
  const departments = await getDepartments();
  const organisations = await getOrganisations();

  /**
   * @TODO
   *  Сделать по-другому (отправлять курсор по кол-ву записей на странице таблицы)
   *  или в компоненте выше на уровне layout-а приложения,
   *  будет долгая первичная загрузка из-за множественных запросов к БД с большим кол-вом записей.
   */
  const formatted = users.items.map(({ organisationId, departmentId, ...user }) => {
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
      <UsersTable data={formatted} />
    </div>
  );
}
