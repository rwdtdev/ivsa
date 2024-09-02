'use client';

import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InventoryAddressFormData,
  InventoryAddressFormSchema
} from '@/lib/form-validation-schemas/inventory-address-schema';
import { Button } from '../ui/button';
import { updateInventoryAddress } from '@/app/actions/server/inventories';
import { Inventory } from '@prisma/client';
import { Loader2 } from 'lucide-react';

type Props = {
  inventory: Inventory;
};

export default function InventoryAddressForm({ inventory }: Props) {
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [isDataSending, setIsDataSending] = useState(false);
  const inputRef = useRef(null);
  const { toast } = useToast();

  const form = useForm<InventoryAddressFormData>({
    resolver: zodResolver(InventoryAddressFormSchema),
    defaultValues: { address: inventory.address || '' },
    reValidateMode: 'onChange',
    resetOptions: { keepErrors: true }
  });

  const processForm: SubmitHandler<InventoryAddressFormData> = async (data) => {
    console.log('submit! data:', data);
    setIsDataSending(true);
    try {
      const sent = await updateInventoryAddress(inventory.id, data.address);
      setIsDataSending(false);
      if (!sent) {
        toast({
          title: 'Ошибка',
          description: (
            <pre className='mt-2 w-full rounded-md bg-red-200 p-4'>
              <p className='text-black'>При сохранении адреса произошла ошибка</p>
            </pre>
          )
        });
      } else {
        setIsFormEdit(false);
      }
    } catch (err) {
      console.log('ошибка при сохранении адреса инвентаризации', err);
    }
  };

  return (
    <Form {...form}>
      <form
        id='inventory-address-form'
        className='mt-6 w-full space-y-6'
        onSubmit={form.handleSubmit(processForm)}
      >
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem className=''>
              <span className='text-sm font-semibold'>Адрес:</span>
              <div className='sm:flex'>
                <FormControl className='mb-2'>
                  <Input
                    {...field}
                    ref={inputRef}
                    placeholder={isFormEdit ? 'Введите адрес' : 'Адрес не указан'}
                    autoFocus
                    className='mr-2'
                    disabled={!isFormEdit}
                  />
                </FormControl>
                {isFormEdit ? (
                  <Button type='submit' disabled={isDataSending} className=''>
                    Применить
                    {isDataSending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  </Button>
                ) : (
                  <Button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsFormEdit(true);
                    }}
                  >
                    Редактировать
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
