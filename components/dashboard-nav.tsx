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
    <nav className='min-w-60 px-3 py-6'>
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
                  {/* <span
                    className={cn(
                      'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      path === item.href ? 'bg-accent' : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                  >
                    <span>{item.title}</span>
                  </span> */}
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
