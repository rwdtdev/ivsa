'use client';
import { setActiveAndSendRecoveryLinkAction } from '@/app/actions/server/user-password';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserView } from '@/types/user';
import { Edit, MoreHorizontal, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface Props {
  data: UserView;
}

export function UserTableRowMenu({ data }: Props) {
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const router = useRouter();


  const onConfirmResetPassword = async () => {
    // setLoading(true);
    await setActiveAndSendRecoveryLinkAction(data.id, data.email);
    // setLoading(false);
    setOpenResetPassword(false);
  };

  return (
    <>
      <AlertDialog open={openResetPassword}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Сбросить пароль для</AlertDialogTitle>
            <AlertDialogTitle> {data.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenResetPassword(false)}>
              Отменить
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600'
              onClick={() => {
                onConfirmResetPassword();
              }}
            >
              Продолжить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*  */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Открыть меню</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Действия</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/admin/users/${data.id}`)}>
            <Edit className='mr-2 h-4 w-4' /> Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenResetPassword(true)}>
            <Bell className='mr-2 h-4 w-4' /> Сбросить пароль
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
