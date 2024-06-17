import { cn } from '@/lib/utils';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react';

type BreadCrumbType = {
  title: string;
  link: string;
};

type BreadCrumbPropsType = {
  items: BreadCrumbType[];
};

export default function BreadCrumb({ items }: BreadCrumbPropsType) {
  return (
    <div className='flex items-center space-x-1 py-2 text-sm text-muted-foreground'>
      {items.length > 1
        ? items?.map((item: BreadCrumbType, index: number) => (
            <React.Fragment key={item.title}>
              {index ? <ChevronRightIcon className='h-4 w-4' /> : ''}
              <Link
                href={item.link}
                className={cn(
                  'font-medium',
                  index === items.length - 1
                    ? 'pointer-events-none text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.title}
              </Link>
            </React.Fragment>
          ))
        : ''}
    </div>
  );
}
