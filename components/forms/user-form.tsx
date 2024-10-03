'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '../ui/use-toast';
import { UserRoles, UserStatuses } from '@/constants/mappings/prisma-enums';
import {
  UserFormData,
  UserFormSchema
} from '@/lib/form-validation-schemas/user-form-schema';
import { ActionType, UserRole, UserStatus } from '@prisma/client';
import { PasswordInput } from '../password-input';
import {
  blockUserAction,
  createUserAction,
  unblockUserAction,
  updateUserAction
} from '@/app/actions/server/users';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import _ from 'underscore';
// import { fakeDepartmentData } from '@/app/admin/users/[id]/fakeDepartmentData';
import DepartmentSelectDialog from '../department-select-dialog/department-select-dialog';

interface UserFormProps {
  userId?: string;
  // initialData: (UserFormData & { createdAt: Date }) | undefined;
  initialData: any | undefined;
  generatedPassword?: string;
}

export function UserForm({ initialData, userId, generatedPassword }: UserFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (initialData) initialData.ASOZSystemRequestNumber = '';

  const action = initialData ? 'Сохранить' : 'Добавить';

  const successToastMessage = initialData
    ? 'Информация о пользователе успешно обновлена.'
    : 'Пользователь успешно добавлен.';

  const defaultValues: UserFormData = initialData
    ? initialData
    : {
        username: '',
        password: generatedPassword || '',
        name: '',
        status: UserStatus.ACTIVE,
        email: '',
        tabelNumber: '',
        phone: '',
        ASOZSystemRequestNumber: '',
        role: UserRole.USER,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues,
    values: initialData
  });

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);

    if (userId && defaultValues.status !== data.status) {
      if (data.status === UserStatus.ACTIVE) {
        unblockUserAction(userId);
      } else {
        blockUserAction({ id: userId, type: ActionType.ADMIN_USER_BLOCK });
      }
    }

    const actionTypes: ActionType[] = [];

    if (initialData?.role !== data.role) {
      actionTypes.push(ActionType.USER_CHANGE_ROLE);
    }

    if (
      !_.isEqual(
        _.pick(
          initialData,
          'name',
          'username',
          'email',
          'phone',
          'expiresAt',
          'status',
          'tabelNumber',
          'departmentId'
          // , organisationId
        ),
        _.pick(
          data,
          'name',
          'username',
          'email',
          'phone',
          'expiresAt',
          'status',
          'tabelNumber',
          'departmentId'
          // , organisationId
        )
      )
    ) {
      actionTypes.push(ActionType.USER_EDIT);
    }

    // pick and upd only changed fields
    const dirtyFields = Object.keys(form.formState.dirtyFields) as Array<
      keyof typeof data
    >;

    const result =
      initialData && userId
        ? await updateUserAction(userId, _.pick(data, dirtyFields), actionTypes)
        : await createUserAction(data);

    if (result && result.error) {
      const { title, userMessage } = JSON.parse(result.error);
      toast({
        variant: 'destructive',
        title: title || 'Что-то пошло не так.',
        description: userMessage || 'Возникла проблема при выполнении запроса.'
      });
    } else {
      toast({
        variant: 'success',
        title: 'Успех.',
        description: successToastMessage
      });
    }

    setLoading(false);
  };

  return (
    <>
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
                          placeholder='Выберите роль'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        UserRole.USER,
                        UserRole.ADMIN,
                        UserRole.USER_ADMIN,
                        UserRole.TECHNOLOGY_OPERATOR,
                        UserRole.DEVELOPER
                      ].map((role, idx) => (
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
                      {[UserStatus.ACTIVE, UserStatus.BLOCKED].map((status, idx) => (
                        <SelectItem key={idx} value={status}>
                          {UserStatuses[status]}
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
              name='ASOZSystemRequestNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер заявки АС ОЗ</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Номер заявки АС ОЗ'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='createdAt'
              render={({ field }) => (
                <FormItem className='disabled flex flex-col'>
                  <FormLabel className='mb-2 block'>Активен с</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className='pl-3 text-left font-normal'
                          disabled
                        >
                          {format(field.value, 'dd.MM.yyyy')}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='expiresAt'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='mb-2 block'>Активен до</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'dd.MM.yyyy')
                          ) : (
                            <span>Выберите дату</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto rounded-md border bg-white p-0'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='departmentId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='mb-2 block'>Отдел</FormLabel>
                  <DepartmentSelectDialog
                    departmentId={field.value}
                    setDepartmentId={form.setValue}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex justify-end'>
            <Link href={'/admin/users'}>
              <Button variant={'outline'} className='mr-4'>
                Отмена
              </Button>
            </Link>
            <Button disabled={loading} className='' type='submit'>
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
