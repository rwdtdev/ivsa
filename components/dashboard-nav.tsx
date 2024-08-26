'use client';

import Link from 'next/link';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className='hidden min-w-60 px-3 py-6 sm:block'>
      <ul className='flex space-x-1'>
        {items.map((item, index) => {
          return (
            item.href && (
              <li key={index}>
                <Link
                  href={item.disabled ? '/' : item.href}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  <Button variant='link'>{item.title}</Button>
                </Link>
              </li>
            )
          );
        })}
      </ul>
    </nav>
  );
}
