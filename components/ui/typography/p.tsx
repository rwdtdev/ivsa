import { ReactChildren } from '@/app/types';
import { cn } from '@/lib/utils';

export function P({
  children,
  className
}: ReactChildren & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>{children}</p>
  );
}
