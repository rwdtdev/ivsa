import { cn } from '@/lib/utils';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './ui/accordion';

type BreadCrumbType = {
  title: string;
  link: string;
};

type BreadCrumbPropsType = {
  items: BreadCrumbType[];
};

export default function BreadCrumb({ items }: BreadCrumbPropsType) {
  const brCrList = [...items];

  return (
    <>
      <div className='hidden items-center space-x-1 px-1 py-2 text-sm text-muted-foreground md:visible md:flex'>
        {/* <div className='flex flex-wrap items-center py-2 text-sm text-muted-foreground'> */}
        {brCrList.length > 1
          ? brCrList?.map((item: BreadCrumbType, index: number) => (
              <React.Fragment key={item.title}>
                {index ? <ChevronRightIcon className='h-4 w-4' /> : ''}
                <Link
                  href={item.link}
                  className={cn(
                    'font-medium',
                    index === brCrList.length - 1
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
      <Accordion type='single' collapsible className='px-1 md:hidden'>
        <AccordionItem value='item-1'>
          <AccordionTrigger className='underline-offset-0'>
            {brCrList.at(-1)?.title}
          </AccordionTrigger>
          <AccordionContent>
            {brCrList.length > 1
              ? brCrList
                  ?.reverse()
                  .slice(1)
                  .map((item: BreadCrumbType, index: number) => (
                    <React.Fragment key={item.title}>
                      <div className={cn(index === brCrList.length - 1 ? '' : 'mb-2')}>
                        <Link
                          href={item.link}
                          className={cn(
                            'font-medium'
                            // index === items.length - 1
                            //   ? 'pointer-events-none text-foreground'
                            //   : 'text-muted-foreground'
                          )}
                        >
                          {item.title}
                        </Link>
                      </div>
                    </React.Fragment>
                  ))
              : ''}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
