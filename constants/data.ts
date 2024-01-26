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
    title: 'Архив видеоинвентаризаций',
    href: '/admin/events/audit',
    icon: 'archive',
    label: 'audit-events'
  }
];
