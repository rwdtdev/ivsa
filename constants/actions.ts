import { ActionStatus, ActionType } from '@prisma/client';

export const unknownUser = 'Неизвестный пользователь';

export const actionTypesMapper = {
  [ActionType.USER_CREATE]: 'Создание пользователя',
  [ActionType.USER_EDIT]: 'Редактирование данных о пользователе',
  [ActionType.USER_CHANGE_ROLE]: 'Изменение системной роли пользователя',
  [ActionType.USER_LOGIN]: 'Авторизация на портале',
  [ActionType.USER_LOGOUT]: 'Выход из учетной записи',
  [ActionType.USER_DOWNLOAD_FILE]: 'Скачивание файлов инвентаризации пользователем',
  [ActionType.USER_LOGGED_INTO_BRIEFING_CONFERENCE]:
    'Переход в конференцию для инструктажа',
  [ActionType.USER_LOGGED_INTO_AUDIT_CONFERENCE]:
    'Переход в конференцию для видеоинвентаризации',
  [ActionType.USER_REQUEST_PASSWORD_RESET]: 'Восстановление пароля пользователем',
  [ActionType.USER_BLOCK_BY_LIMIT_LOGIN_ATTEMPTS]:
    'Блокировка пользователя из-за превышения попыток ввода пароля',
  [ActionType.ADMIN_USER_PASSWORD_RESET]: 'Сброс пароля пользователя администратором',
  [ActionType.ADMIN_USER_BLOCK]: 'Блокировка пользователя администратором',

  /* ----Системные события---- */
  [ActionType.SYSTEM_MOVE_RESOURCES_TO_OPERATIVE_STORAGE_START]:
    'Начало переноса видео-ресурсов и метаданных в Оперативное хранилище',
  [ActionType.SYSTEM_MOVE_RESOURCES_TO_OPERATIVE_STORAGE_END]:
    'Окончание переноса видео-ресурсов и метаданных в Оперативное хранилище',
  [ActionType.SYSTEM_MOVE_RESOURCES_FROM_OPERATIVE_TO_ARCHIVE_STORAGE_START]:
    'Начало переноса видео-ресурсов и метаданных из Оперативного хранилища в Архивное',
  [ActionType.SYSTEM_MOVE_RESOURCES_FROM_OPERATIVE_TO_ARCHIVE_STORAGE_END]:
    'Окончание переноса видео-ресурсов и метаданных из Оперативного хранилища в Архивное',

  /* ----Внешние события по запросам СБО СОИ. ЭДО. ИНВ. ВИ---- */
  [ActionType.SOI_EVENT_CREATE]: 'Создание события инвентаризации',
  [ActionType.SOI_AUDIT_OPEN]: 'Открытие инвентаризационной описи и конференции IVA R',
  [ActionType.SOI_AUDIT_CLOSE]: 'Закрытие инвентаризационной описи и конференции IVA R',
  [ActionType.SOI_BRIEFING_OPEN]: 'Открытие конференции для инструктажа в IVA R',
  [ActionType.SOI_BRIEFING_CLOSE]: 'Закрытие конференции для инструктажа в IVA R',
  [ActionType.SOI_EVENT_PARTICIPANTS_CHANGE]:
    'Изменение состава участников события инвентаризации',
  [ActionType.SOI_CHECK_USERS]: 'Проверка зарегистрированных в системе пользователей'
};

export const actionStatusesMapper = {
  [ActionStatus.SUCCESS]: 'Успешно',
  [ActionStatus.ERROR]: 'Ошибка'
};
