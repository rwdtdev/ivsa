// import { DataTable } from '@/components/ui/data-table';
// import { User, columns } from '@/app/admin/users/columns';
import { getUsers } from '@/server/services/users';

// const UsersPage = async () => {
//   console.log(users);
//   //   const organisations = await getOrganisations();
//   //   const departments = await getDepartments();

//   return (
//     <div className='mx-auto py-10'>
//       <h1>Пользователи</h1>

//       <DataTable columns={columns} data={users.items} />
//     </div>
//   );
// };

// export default UsersPage;

import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/user-tables/client';
import { getDepartments } from '@/app/actions/server/departments';
import { getOrganisations } from '@/app/actions/server/organisations';
import { User } from '@prisma/client';

const breadcrumbItems = [{ title: 'Пользователи', link: '/admin/users' }];

export default async function page() {
  const users = await getUsers();
  const departments = await getDepartments();
  const organisations = await getOrganisations();

  const formatted = users.items.map((user) => {
    const department = departments.find(
      (department) => department.id === user.departmentId
    );

    const organisation = organisations.find(
      (organisation) => organisation.id === user.organisationId
    );

    return {
      ...user,
      departmentId: department?.name,
      organisationId: organisation?.name
    };
  });

  return (
    <>
      <div className='flex-1 space-y-4  p-4 pt-6 md:p-8'>
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={formatted} />
      </div>
    </>
  );
}
