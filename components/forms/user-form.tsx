'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '../ui/use-toast';
import { UserRoles, UserStatuses } from '@/constants';
import {
  UserFormData,
  UserFormSchema
} from '@/lib/form-validation-schemas/user-form-schema';
import { Department, Organisation, UserRole, UserStatus } from '@prisma/client';
import { PasswordInput } from '../password-input';
import { createUserAction, updateUserAction } from '@/app/actions/server/users';

interface UserFormProps {
  initialData: any | null;
  organisations: any;
  departments: any;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  organisations,
  departments
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Редактирование пользователя' : 'Добавление пользователя';
  const description = initialData
    ? 'Изменить данные пользователя.'
    : 'Добавить нового пользователя в систему ASVI';
  const toastMessage = initialData
    ? 'Данные пользователя обновлены.'
    : 'Пользователь добавлен.';
  const action = initialData ? 'Сохранить' : 'Добавить';

  const defaultValues = initialData
    ? initialData
    : {
        username: '',
        password: '',
        name: '',
        status: '',
        orgnisationId: '',
        departmentId: '',
        email: '',
        tabelNumber: '',
        phone: '',
        role: ''
      };

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (initialData) {
      form.setValue('username', initialData.username);
      form.setValue('name', initialData.name);
      form.setValue('status', initialData.status);
      form.setValue('organisationId', initialData.organisationId);
      form.setValue('departmentId', initialData.departmentId);
      form.setValue('email', initialData.email);
      form.setValue('tabelNumber', initialData.tabelNumber);
      form.setValue('phone', initialData.phone);
      form.setValue('role', initialData.role);
    }
  }, [initialData]);

  const serializeDataForDB = (data: UserFormData) => {
    const enumFields = ['roles', 'status'];

    for (let key in data) {
      if (typeof key === 'string' && !enumFields.includes(key)) {
        data[key] = data[key].trim();
      }
    }

    return data;
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const pathnameChunks = pathname.split('/');
      const userId = pathnameChunks[pathnameChunks.length - 1];
      // const userData = serializeDataForDB(data);

      setLoading(true);
      if (initialData) {
        await updateUserAction(userId, data);
        toast({
          variant: 'success',
          title: 'Успех.',
          description: 'Информация о пользователе успешно обновлена.'
        });
      } else {
        await createUserAction(data);
        toast({
          variant: 'success',
          title: 'Успех.',
          description: 'Пользователь успешно добавлен.'
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Что-то пошло не так.',
        description: 'Возникла проблема при выполнении запроса.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {/* {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )} */}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
          <div className='gap-8 md:grid md:grid-cols-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='ФИО пользователя' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Имя пользователя' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!initialData && (
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <PasswordInput disabled={loading} placeholder='Пароль' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Эл. почта</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Адрес электронной почты'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tabelNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Табельный номер</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Табельный номер учетной записи АС ВИ'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Рабочий телефон</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Рабочий телефон' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Выберете роль'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[UserRole.ADMIN, UserRole.USER].map((role, idx) => (
                        <SelectItem key={idx} value={role}>
                          {UserRoles[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='organisationId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Организация</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organisations.map((organisation: Organisation, idx: number) => (
                        <SelectItem key={idx} value={organisation.id}>
                          {organisation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='departmentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отдел</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department: Department, idx: number) => (
                        <SelectItem key={idx} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.RECUSED].map(
                        (status, idx) => (
                          <SelectItem key={idx} value={status}>
                            {UserStatuses[status]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
