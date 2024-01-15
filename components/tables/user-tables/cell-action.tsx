'use client';
import { deleteUser } from '@/app/actions/server/users';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User } from '@prisma/client';
import { Edit, MoreHorizontal, Trash, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openRemoveUser, setOpenRemoveUser] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const router = useRouter();

  const onConfirmRemoveUser = async () => {
    await deleteUser(data.id);
  };

  const onConfirmResetPassword = async () => {
    console.log('Password reset');
  };

  return (
    <>
      <AlertModal
        isOpen={openRemoveUser}
        onClose={() => setOpenRemoveUser(false)}
        onConfirm={onConfirmRemoveUser}
        loading={loading}
      />
      <AlertModal
        isOpen={openResetPassword}
        onClose={() => setOpenResetPassword(false)}
        onConfirm={onConfirmResetPassword}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Открыть меню</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Действия</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/users/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Изменить
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenResetPassword(true)}>
            <Bell className='mr-2 h-4 w-4' /> Сбросить пароль
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenRemoveUser(true)}>
            <Trash className='mr-2 h-4 w-4' /> Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
