import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Inventory } from '@prisma/client';
import { format } from 'date-fns';

type Props = {
  inventories?: Inventory[];
};
//
export default function InventorySelectMenu({ inventories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('locinvid', value);
      } else {
        params.delete('locinvid');
      }
      params.set('page', '1');

      return params.toString();
    },
    [searchParams]
  );

  const complexInventory = inventories?.filter((item) => item.parentId === null);
  const localInventories = inventories?.filter((item) => item.parentId !== null);
  return (
    <Select
      value={searchParams.get('locinvid') || 'complex'}
      onValueChange={(v) => {
        const sp =
          v === 'complex' ? '?' + createQueryString(null) : '?' + createQueryString(v);
        router.push(pathname + sp);
      }}
    >
      <SelectTrigger className='h-8 select-none focus:ring-0'>
        <SelectValue placeholder='Выберите опись' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Комплексная опись</SelectLabel>
          {complexInventory?.map((inv) => (
            <SelectItem value='complex' key={inv.id}>
              {`Комплексная №  ${inv.number} от ${format(inv.date || '', 'dd.MM.yyyy')} форма ${inv.shortName}`}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Локальные описи</SelectLabel>
          {localInventories && localInventories[0] ? (
            localInventories.map((inv) => (
              <SelectItem value={inv.id} key={inv.id}>
                {`Локальная № ${inv.number} от ${format(inv.date || '', 'dd.MM.yyyy')} форма ${inv.shortName}`}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled value='noLocalInventories'>
              Нет локальных записей
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
