'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  SetUserPasswordFormData,
  SetUserPasswordFormSchema
} from '@/lib/form-validation-schemas/set-user-password-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { setPermanentUserPassword } from '@/app/actions/server/update-user-password';
import { LogOutIcon } from 'lucide-react';
import { logoutAction } from '@/app/actions/server/users';

const ChangePasswordForm = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    router.push('/login');
  }

  const form = useForm<SetUserPasswordFormData>({
    resolver: zodResolver(SetUserPasswordFormSchema),
    defaultValues: { password: '', confirm: '' },
    reValidateMode: 'onSubmit'
  });

  const processForm: SubmitHandler<SetUserPasswordFormData> = async (data) => {
    if (session && session.user) {
      const result = await setPermanentUserPassword(data, session.user.id);

      if (result.success) {
        signOut({ callbackUrl: '/login' });
      } else {
        toast({
          title: 'Ошибка',
          variant: 'destructive',
          description: result.error
        });
      }
    }
  };

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Установка пароля</CardTitle>
        <CardDescription>Задайте пароль для учетной записи</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='w-full space-y-6' onSubmit={form.handleSubmit(processForm)}>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Введите пароль' autoFocus {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirm'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Введите повторно' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-5 gap-4'>
              <Button className='col-span-4 w-full' type='submit'>
                Сохранить
              </Button>
              <Button
                className='w-full'
                type='submit'
                variant='destructive'
                onClick={(e) => {
                  e.preventDefault();
                  signOut({ callbackUrl: '/login' });
                  logoutAction();
                }}
              >
                <LogOutIcon />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
