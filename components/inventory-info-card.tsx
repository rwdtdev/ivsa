'use client';
import { InventoryStatusBadge } from '@/components/event-status-badge';
import InventoryAddressForm from '@/components/forms/inventory-address-form';
import { IvaChairmanDialogBtn } from '@/components/iva-chairmen-dialog-btn';
import IvaLocatorBtn from '@/components/iva-locator-btn';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { P } from '@/components/ui/typography/p';
import { DATE_FORMAT } from '@/constants/date';
import { Inventory, Participant, ParticipantRole, User } from '@prisma/client';
import moment from 'moment';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { setInventoryVideographer } from '@/app/actions/server/inventories';
import { ParticipantRoles } from '@/constants/mappings/prisma-enums';

type Props = {
  inventory: Inventory;
  isUserChairman: boolean;
  isAndroid: boolean;
  locatorIvaLink: {
    locatorIvaStart: string;
    locatorStop: string;
  };
  participants: (Participant & { user: User })[];
};

export function InventoryInfoCard({
  inventory,
  isUserChairman,
  isAndroid,
  locatorIvaLink,
  participants
}: Props) {
  // console.log('🚀 ~ participants:', participants);
  const [address, setAddress] = useState(inventory.address);
  const [videographerId, setVideographerId] = useState(inventory.videographerId);

  return (
    <Card className='mb-5 flex grow pb-4 pt-3 lg:mb-0 lg:mr-5'>
      <CardContent className='flex grow flex-col'>
        <div className='flex'>
          <P className='mr-2 text-sm font-semibold'>Статус:</P>
          <InventoryStatusBadge status={inventory.status} />
        </div>
        <P className='text-sm'>
          <span className='font-semibold'>Название:</span> {inventory.name}
        </P>
        <P className='text-sm'>
          <span className='font-semibold'>Краткое название:</span> {inventory.shortName}
        </P>
        <P className='text-sm'>
          <span className='font-semibold'>Дата:</span>{' '}
          {moment(inventory.date).format(DATE_FORMAT)}
        </P>
        <P className='text-sm'>
          <span className='font-semibold'>Номер:</span> {inventory.number}
        </P>
        <P className='text-sm'>
          <span className='font-semibold'>Код:</span> {inventory.code}
        </P>
        <P className='mb-2 text-sm'>
          <span
            className={`font-semibold ${videographerId || !isUserChairman ? '' : 'text-red-600'}`}
          >
            Участник проводящий видеофиксацию:
          </span>{' '}
          {!isUserChairman &&
            participants.find(
              (participant) => participant.user?.id === inventory.videographerId
            )?.user.name}
        </P>
        {isUserChairman && (
          <Select
            onValueChange={async (videographerId) => {
              const res = await setInventoryVideographer(inventory.id, videographerId);

              setVideographerId(res.videographerId);
            }}
            defaultValue={inventory.videographerId ? inventory.videographerId : undefined}
          >
            <SelectTrigger
              className={`w-auto min-w-48 self-start ${videographerId ? '' : 'border-rose-700'}`}
            >
              <SelectValue placeholder='Выберите участника' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {participants
                  .filter(
                    ({ role, user }) =>
                      user &&
                      (role === ParticipantRole.FINANCIALLY_RESPONSIBLE_PERSON ||
                        role === ParticipantRole.PARTICIPANT)
                  )
                  .map((participant) => (
                    <SelectItem key={participant.id} value={participant.user.id}>
                      {ParticipantRoles[participant.role]}. {participant.user.name},{' '}
                      {participant.tabelNumber}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {isUserChairman ? (
          <InventoryAddressForm
            inventory={inventory}
            address={address}
            setAddress={setAddress}
          />
        ) : (
          <P className='mb-6 text-sm'>
            <span className='font-semibold'>Адрес:</span>{' '}
            {inventory.address ? inventory.address : 'не указан'}
          </P>
        )}

        <div className='mt-auto sm:mt-4'>
          {isAndroid ? (
            <IvaLocatorBtn locatorIvaLink={locatorIvaLink} />
          ) : !inventory.auditRoomInviteLink ? (
            <span className='border-grey-600 rounded-md border p-2'>
              ссылка на видеоконференцию отсутствует
            </span>
          ) : isUserChairman ? (
            <IvaChairmanDialogBtn
              auditRoomInviteLink={inventory.auditRoomInviteLink}
              address={address}
              videographerId={videographerId}
            />
          ) : (
            <Button>
              <a href={inventory.auditRoomInviteLink} target='_blank'>
                Перейти в видеоконференцию
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
