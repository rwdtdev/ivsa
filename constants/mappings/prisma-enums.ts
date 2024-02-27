export const UserRoles = {
  ADMIN: 'Администратор',
  USER: 'Пользователь',
  CHAIRMAN: 'Председатель',
  PARTICIPANT: 'Участник комиссии',
  FINANCIALLY_RESPONSIBLE_PERSON: 'Материально-ответственное лицо',
  ACCOUNTANT: 'Бухгалтер',
  INSPECTOR: 'Проверяющий',
  MANAGER: 'Руководитель',
  ACCOUNTANT_ACCEPTOR: 'Акцепт-бухгалтер',
  ENGINEER: 'Оператор-технолог'
} as const;

export const UserStatuses = {
  ACTIVE: 'Активен',
  BLOCKED: 'Заблокирован',
  RECUSED: 'Освобожден от должности'
};

export const UserStatus = {
  active: 'active',
  blocked: 'blocked'
};

export const EventStatuses = {
  OPEN: 'Открыта',
  CLOSED: 'Закрыта',
  REMOVED: 'Удалена'
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
