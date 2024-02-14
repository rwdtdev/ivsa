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
    href: '/admin/events?type=audit',
    icon: 'table',
    label: 'audit-events'
  },
  {
    title: 'Реестр инструктажей',
    href: '/admin/events?type=briefing',
    icon: 'table',
    label: 'briefing-events'
  }
];

export const SortOrder = {
  Ascending: 'asc',
  Descending: 'desc'
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
