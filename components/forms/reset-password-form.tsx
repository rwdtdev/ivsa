'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateUserPassword } from '@/app/actions/server/update-user-password';
import {
  ResetPasswordFormData,
  ResetPasswordFormSchema
} from '@/lib/form-validation-schemas/reset-password-schema';
import { getPayload } from '@/app/actions/server/get-payload-from-token';

const ResetPasswordForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = React.useState('');
  const { toast } = useToast();

  const pathnameChunks = pathname.split('/');
  const token = pathnameChunks[pathnameChunks.length - 1].trim();

  const getUserFromToken = async () => {
    const payload = await getPayload(token);

    if (payload) {
      setUsername(payload);
    }
  };

  React.useEffect(() => {
    getUserFromToken();
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { password: '', confirm: '' }
  });

  const processForm: SubmitHandler<ResetPasswordFormData> = async (data) => {
    const isUpdatedPassword = await updateUserPassword(data, username);

    if (!isUpdatedPassword) {
      toast({
        title: 'Ошибка',
        description: (
          <pre className='mt-2 w-[350px] rounded-md bg-red-200 p-4'>
            <p className='text-black'>При обновлении пароля произошла ошибка</p>
          </pre>
        )
      });
    } else {
      router.push('/login');
    }
  };

  if (!username) {
    return (
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Что-то пошло не так</CardTitle>
          <CardDescription>
            Ссылка недействительна или срок ее действия истек.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Восстановление</CardTitle>
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
                    <Input placeholder='Введите новый пароль' autoFocus {...field} />
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
            <Button className='w-full' type='submit'>
              Сохранить
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
