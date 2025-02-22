import { UserRole } from '@prisma/client';

export const UserRoles: Record<keyof typeof UserRole, string> = {
  ADMIN: 'Администратор',
  USER: 'Пользователь',
  TECHNOLOGY_OPERATOR: 'Оператор-технолог',
  DEVELOPER: 'Разработчик',
  USER_ADMIN: 'Администратор пользователей'
} as const;

export const ParticipantRoles = {
  CHAIRMAN: 'Председатель',
  PARTICIPANT: 'Участник комиссии',
  FINANCIALLY_RESPONSIBLE_PERSON: 'МОЛ',
  ACCOUNTANT: 'Бухгалтер',
  INSPECTOR: 'Проверяющий',
  MANAGER: 'Руководитель',
  ACCOUNTANT_ACCEPTOR: 'Акцепт-бухгалтер'
} as const;

export const UserStatuses = {
  ACTIVE: 'Активен',
  BLOCKED: 'Заблокирован'
};

export const UserStatus = {
  active: 'active',
  blocked: 'blocked'
};

export const AccountExpiration = {
  VALID: 'Действует',
  EXPIRED: 'Истек'
};

export const EventStatuses = {
  ACTIVE: 'Активна',
  REMOVED: 'Удалена'
};

export const InventoryStatuses = {
  AVAILABLE: 'Доступна',
  REMOVED: 'Удалена',
  CLOSED: 'Закрыта'
};

export const BriefingStatuses = {
  NOT_STARTED: 'Не начат',
  IN_PROGRESS: 'В процессе',
  PASSED: 'Пройден'
};

export const ConferenceRoles = {
  ATTENDEE: 'Участник-комиссии',
  SPEAKER: 'Председатель',
  MODERATOR: 'Модератор'
};
