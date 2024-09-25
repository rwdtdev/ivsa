'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authenticate } from '@/app/actions/client/auth';
import {
  LoginFormData,
  LoginFormSchema
} from '@/lib/form-validation-schemas/login-form-schema';
import { PasswordInput } from '../password-input';
import { IsBlocked, loginAction } from '@/app/actions/server/users';
import { ActionStatus } from '@prisma/client';

export default function LoginForm() {
  const { toast } = useToast();
  // const searchParams = useSearchParams();
  // const previousURL = searchParams.get('callbackUrl');
  // const redirectPath = (previousURL && new URL(previousURL).pathname) || '/';
  // console.log('🚀 ~ redirectPath:', redirectPath);

  /**
   * @TODO How to add debounce to form inputs for disabling instantly validation
   */

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const processForm: SubmitHandler<LoginFormData> = async (data) => {
    const isAuthenticated = await authenticate(data);

    if (!isAuthenticated) {
      /** @TODO Add errors dict for toasts */
      toast({
        title: 'Ошибка',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-red-200 p-4'>
            <p className='text-black'>Неверный логин или пароль</p>
          </pre>
        )
      });
      loginAction({
        status: ActionStatus.ERROR,
        details: { error: 'Неверный логин или пароль', loginInput: data.username }
      });
      return;
    }

    const isBlocked = await IsBlocked(data.username); // move isBlock check after IsAuthenticated otherwise throw error if no user

    console.log(isBlocked)

    if (isBlocked) {
      toast({
        title: 'Ошибка',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-red-200 p-4'>
            <p className='text-black'>Пользователь заблокирован.</p>
            <p className='text-black'>Обратитесь к администратору системы.</p>
          </pre>
        )
      });
      await loginAction({
        status: ActionStatus.ERROR,
        details: { error: 'Пользователь заблокирован' }
      });
      return;
    }
    loginAction({ status: ActionStatus.SUCCESS });
    window.location.replace('/');
  };

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Вход</CardTitle>
        <CardDescription className='text-left'>
          Аутентификация в автоматизированной системе видеоинвентаризации
          с&nbsp;применением ПО&nbsp;IVA&nbsp;R (АС ВИ)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='w-full space-y-6' onSubmit={form.handleSubmit(processForm)}>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя пользователя</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type='submit'>
              Войти
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='justify-center'>
        <Link className='text-sm font-medium hover:underline' href='/forgot-password'>
          Забыли пароль?
        </Link>
      </CardFooter>
    </Card>
  );
}
