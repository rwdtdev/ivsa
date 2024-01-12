import { DataTable } from '@/components/ui/data-table';
import { User, columns } from '@/app/admin/users/columns';
import { getUsers } from '@/server/services/users';

const UsersPage = async () => {
  const users = await getUsers();
  console.log(users);
  //   const organisations = await getOrganisations();
  //   const departments = await getDepartments();

  return (
    <div className='mx-auto py-10'>
      <h1>Пользователи</h1>

      <DataTable columns={columns} data={users.items} />
    </div>
  );
};

export default UsersPage;
