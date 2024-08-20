'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  // FormDescription,
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
import { /* Department, Organisation, */ UserRole, UserStatus } from '@prisma/client';
import { PasswordInput } from '../password-input';
import { createUserAction, updateUserAction } from '@/app/actions/server/users';
import _ from 'underscore';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface UserFormProps {
  userId?: string;
  initialData: any | null;
  // organisations: any;
  // departments: any;
  monitoringData: MonitoringData;
}

export interface MonitoringData {
  ip: string | null;
  initiator: string;
  details?: {
    adminUsername: string;
    error?: string;
    editedUserUserName?: string;
    editedUserName?: string;
  };
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  // organisations,
  // departments,
  userId,
  monitoringData
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const action = initialData ? 'Сохранить' : 'Добавить';

  const successToastMessage = initialData
    ? 'Информация о пользователе успешно обновлена.'
    : 'Пользователь успешно добавлен.';

  const defaultValues: Partial<UserFormData> = initialData
    ? initialData
    : {
        username: '',
        password: '',
        name: '',
        status: UserStatus.ACTIVE,
        email: '',
        tabelNumber: '',
        phone: '',
        role: UserRole.USER,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues,
    values: initialData
  });

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);

    const result =
      initialData && userId
        ? await updateUserAction(userId, data, monitoringData)
        : await createUserAction(data, monitoringData);

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
                          placeholder='Выберете роль'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(_.pick(UserRole, UserRole.ADMIN, UserRole.USER)).map(
                        (role, idx) => (
                          <SelectItem key={idx} value={role}>
                            {UserRoles[role as keyof typeof UserRole]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
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
            /> */}
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
            {/* <FormField
              control={form.control}
              name='expiresAt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Срок действия учетной записи</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Рабочий телефон' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
              control={form.control}
              name='expiresAt'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel className='mb-2 block'>Активен до</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'dd.MM.yyyy')
                          ) : (
                            <span>Pick a date</span>
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
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription> */}
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
