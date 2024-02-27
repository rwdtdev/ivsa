import { NavItem } from '@/types';

export const dictionaryItems: NavItem[] = [
  //   {
  //     title: 'Дэшборд',
  //     href: '/admin',
  //     icon: 'dashboard',
  //     label: 'Dashboard'
  //   },
  {
    title: 'Пользователи',
    href: '/admin/users',
    icon: 'user',
    label: 'user'
  }
];

export const registryItems: NavItem[] = [
  {
    title: 'Реестр инвентаризаций',
    href: '/admin/events',
    icon: 'table',
    label: 'events'
  }
];

export const SortOrder = {
  Ascending: 'asc',
  Descending: 'desc'
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
