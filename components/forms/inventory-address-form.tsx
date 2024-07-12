'use client';

import { Dispatch, SetStateAction, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InventoryAddressFormData,
  InventoryAddressFormSchema
} from '@/lib/form-validation-schemas/inventory-address-schema';

type Props = {
  locatorIvaStart: string;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export default function InventoryAddressForm({
  locatorIvaStart,
  setIsDrawerOpen
}: Props) {
  const inputRef = useRef(null);
  const { toast } = useToast();

  const form = useForm<InventoryAddressFormData>({
    resolver: zodResolver(InventoryAddressFormSchema),
    defaultValues: { address: '' },
    reValidateMode: 'onChange',
    resetOptions: { keepErrors: true }
  });

  const processForm: SubmitHandler<InventoryAddressFormData> = async (data) => {
    console.log('submit! data:', data);
    // const sent = await sendRecoveryLinkAction(data);
    const sent = true;
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
      setIsDrawerOpen(false);
      window.open(locatorIvaStart + '&address=' + data.address.trim());
    }
  };

  return (
    <Form {...form}>
      <form
        id='inventory-address-form'
        className='w-full space-y-6'
        onSubmit={form.handleSubmit(processForm)}
      >
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem className='px-4'>
              <FormControl>
                <Input {...field} ref={inputRef} placeholder='введите адрес' autoFocus />
              </FormControl>
              <FormLabel>Адрес должен содержать более 4х символов</FormLabel>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
