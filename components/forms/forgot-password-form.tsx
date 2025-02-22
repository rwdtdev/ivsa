'use client';
import { useRef, useState } from 'react';
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
import { sendRecoveryLinkAction } from '@/app/actions/server/user-password';
import {
  ForgotPasswordFormData,
  ForgotPasswordFormSchema
} from '@/lib/form-validation-schemas/forgot-password-schema';

const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef(null);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: { email: '' }
  });

  const processForm: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    const sent = await sendRecoveryLinkAction(data);
    if (!sent) {
      toast({
        title: 'Ошибка',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-red-200 p-4'>
            <p className='text-black'>При отправке произошла ошибка</p>
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
          На указанный адрес электронной почты будет выслан временный пароль для входа в систему
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='w-full space-y-6' onSubmit={form.handleSubmit(processForm)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес электронной почты (e-mail)</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} ref={emailInputRef} />
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
          Временный пароль для входа в систему успешно отправлен.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full' onClick={() => router.push('/login')}>
          Войти
        </Button>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
