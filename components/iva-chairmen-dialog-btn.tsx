'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

type Props = {
  auditRoomInviteLink: string;
  address: string | null;
};

export function IvaChairmanDialogBtn({ auditRoomInviteLink, address }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!address}>Перейти в видеоконференцию</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle className='pt-4'>
            Не забудьте включить запись видео&#8209;конференции
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className='w-full'
              onClick={() => {
                window.open(auditRoomInviteLink);
              }}
            >
              ОК
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
