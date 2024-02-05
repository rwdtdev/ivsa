import { SortDirection } from '@/server/types';
import { NavItem } from '@/types';

export const navItems: NavItem[] = [
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
  },
  {
    title: 'Архив инвентаризаций',
    href: '/admin/events?type=audit',
    icon: 'archive',
    label: 'audit-events'
  },
  {
    title: 'Архив инструктажей',
    href: '/admin/events?type=briefing',
    icon: 'archive',
    label: 'briefing-events'
  }
];

export const SortOrder = {
  Ascending: 'asc',
  Descending: 'desc'
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
