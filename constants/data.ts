import { NavItem } from '@/types';

export const dictionaryItems: NavItem[] = [
  {
    title: 'Дашборд',
    href: '/admin',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Пользователи',
    href: '/admin/users',
    icon: 'user',
    label: 'user'
  },
  {
    title: 'Реестр инвентаризаций',
    href: '/',
    icon: 'table',
    label: 'events'
  }
];

export const SortOrder = {
  Ascending: 'asc',
  Descending: 'desc'
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
