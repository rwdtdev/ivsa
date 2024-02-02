import { ReactChildren } from '@/app/types';
import { cn } from '@/lib/utils';

export function TypographyP({ children, ...props }: ReactChildren) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', props.className)}>
      {children}
    </p>
  );
}
