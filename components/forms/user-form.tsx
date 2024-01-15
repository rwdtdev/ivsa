'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast';
import { UserRole } from '@/server/services/user-roles/UserRole';
import { UserRoles } from '@/constants';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Не менее 3 символов' }),
  password: z
    .string()
    .min(12, { message: 'Не менее 12 символов' })
    .max(32, { message: 'Не более 32 символов' }),
  name: z.string().min(10, { message: 'Не менее 10 символов' }),
  // organisationId: z.string(),
  // departmentId: z.string(),
  email: z.string().email('Неверный формат'),
  tabelNumber: z.string().min(1, { message: 'Не менее 1 символа' }), //@TODO сколько?
  phone: z.string().min(10, { message: 'Не менее 10 символов' })
  // roles: z.enum([UserRoles.admin.ru, UserRoles.user.ru])
});

type UserFormValues = z.infer<typeof formSchema>;

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Редактировать' : 'Добавление пользователя';
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
        orgnisationId: '',
        departmentId: '',
        email: '',
        tabelNumber: '',
        phone: '',
        roles: []
      };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
        // const res = await axios.post(`/api/products/create-product`, data);
        // console.log("product", res);
      }
      router.refresh();
      router.push(`/admin/users`);
      toast({
        variant: 'destructive',
        title: 'Что-то пошло не так.',
        description: 'Возникла проблема при выполнении запроса.'
      });
    } catch (error: any) {
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
        {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-8'
        >
          <div className='gap-8 md:grid md:grid-cols-3'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Имя пользователя'
                      {...field}
                    />
                  </FormControl>
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
                    <Input disabled={loading} placeholder='Пароль' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='ФИО пользователя'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='roles'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роли</FormLabel>
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
                      {/* @ts-ignore  */}
                      {[
                        'Не выбрано',
                        UserRoles.admin.ru,
                        UserRoles.user.ru
                      ].map((role, idx) => (
                        <SelectItem key={idx} value={role}>
                          {role}
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
                      {/* @ts-ignore  */}
                      {organisations.map((orgnisation) => (
                        <SelectItem
                          key={orgnisation._id}
                          value={orgnisation._id}
                        >
                          {orgnisation.name}
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
                      {/* @ts-ignore  */}
                      {departments.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.name}
                        </SelectItem>
                      ))}
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
