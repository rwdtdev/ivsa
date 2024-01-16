'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { UserTableView } from '@/types/composition';

interface UserListProps {
  data: UserTableView[];
}

export const UsersTable: React.FC<UserListProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Пользователи (${data.length})`}
          description='Управление пользователями'
        />
        <Button
          className='text-xs md:text-sm'
          onClick={() => router.push(`/admin/users/new`)}
        >
          <Plus className='mr-2 h-4 w-4' /> Добавить
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
    </>
  );
};
