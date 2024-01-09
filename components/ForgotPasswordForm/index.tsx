'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ForgotPasswordFormData, ForgotPasswordFormSchema } from './schema';
import { resetPassword } from '@/app/actions/server/reset-password';

const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: { email: '' }
  });

  const processForm: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    const sent = await resetPassword(data);
    if (!sent) {
      toast({
        title: 'Ошибка',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-red-200 p-4'>
            <p className='text-black'>При отправке пароля произошла ошибка</p>
          </pre>
        )
      });
    } else {
      setIsSubmitted(true);
    }
  };

  return !isSubmitted ? (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Восстановление пароля</CardTitle>
        <CardDescription>
          На указанный адрес электронной почты будет выслан новый
          сгенерированный пароль
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='w-full space-y-6'
            onSubmit={form.handleSubmit(processForm)}
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес электронной почты (E-mail)</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 grid-rows-1 gap-5'>
              <Button className='w-full' onClick={() => router.back()}>
                Назад
              </Button>
              <Button className='w-full' type='submit'>
                Отправить
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  ) : (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Отправлено</CardTitle>
        <CardDescription>
          Ссылка для восстановления пароля успешно отправлено.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ForgotPasswordForm;
