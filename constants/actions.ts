import { ActionStatus, ActionType } from '@prisma/client';

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

export const actionTypeSerializeSchema = {
  /*  ----Пользовательские события--- */
  // Создание пользователя в системе
  [ActionType.USER_CREATE]: {
    admin: {
      key: 'Администратор',
      subKeys: {
        adminUsername: 'Логин',
        adminDepartment: 'Отдел'
      }
    },
    createdUser: {
      key: 'Созданный пользователь',
      subKeys: {
        createdUserName: 'Пользователь',
        createdName: 'ФИО'
      }
    }
  },
  // Редактирование данных о пользователе. Не включает изменение роли
  [ActionType.USER_EDIT]: {
    admin: {
      key: 'Администратор',
      subKeys: {
        adminUsername: 'Логин'
        // adminDepartment: 'Отдел'
      }
    },
    createdUser: {
      key: 'Отредактированный пользователь',
      subKeys: {
        editedUserUserName: 'Логин',
        editedUserName: 'ФИО'
      }
    }
  },
  // Изменение системной роли пользователя
  [ActionType.USER_CHANGE_ROLE]: {
    admin: {
      key: 'Администратор',
      subKeys: {
        adminUsername: 'Логин',
        adminDepartment: 'Отдел'
      }
    },
    createdUser: {
      key: 'Отредактированный пользователь',
      subKeys: {
        editedUserUsername: 'Логин',
        editedUserName: 'ФИО',
        roleBefore: 'Роль до',
        roleAfter: 'Роль после'
      }
    }
  },
  // Успешная авторизация на портале
  [ActionType.USER_LOGIN]: {
    loggedinUser: {
      key: 'Пользователь',
      subKeys: {
        username: 'Логин',
        name: 'ФИО',
        // department: 'Отдел',
        status: 'Статус'
      }
    }
  },
  // Выход пользователя из учетной записи
  [ActionType.USER_LOGOUT]: {
    loggedoutUser: {
      key: 'Пользователь',
      subKeys: {
        username: 'Логин',
        department: 'Отдел'
      }
    }
  },
  // Скачивание файлов инвентаризации пользователем (метаданных или видео-ресурсов)
  [ActionType.USER_DOWNLOAD_FILE]: {
    loggedinUser: {
      key: 'Пользователь',
      subKeys: {
        username: 'Логин',
        department: 'Отдел',
        videoFileName: 'Название видео-файла', // возможно лучше идентификатор файла т.е. по названию сложно будет найти файл в хранилище
        subtitlesFileName: 'Название файла мета-данных', // возможно лучше идентификатор файла т.е. по названию сложно будет найти файл в хранилище
        videoFileSize: 'Размер видео-файла'
      }
    }
  },
  // Пользователь зашел в конференцию для инструктажа (Кликнул на иконку входа в конференцию на портале)
  [ActionType.USER_LOGGED_INTO_BRIEFING_CONFERENCE]: {},
  // Пользователь перешел на страницу входа в конференцию IVA R по описи (кликнул на кнопку входа в конференцию в карточке описи)
  [ActionType.USER_LOGGED_INTO_AUDIT_CONFERENCE]: {},
  // Пользователь инициировал процесс восстановления пароля (по клику на кнопку с отправкой нового пароля на e-mail)
  [ActionType.USER_REQUEST_PASSWORD_RESET]: {},
  // Пользователь был заблокирован из-за превышения попыток ввода пароля, входа в систему
  [ActionType.USER_BLOCK_BY_LIMIT_LOGIN_ATTEMPTS]: {},
  // Администратор сбросил пользователю пароль
  [ActionType.ADMIN_USER_PASSWORD_RESET]: {},
  // Блокировка пользователя администратором
  [ActionType.ADMIN_USER_BLOCK]: {},

  /* ----Системные события---- */
  // Начало переноса обработанных видео-ресурсов и метаданных в Оперативное хранилище
  [ActionType.SYSTEM_MOVE_RESOURCES_TO_OPERATIVE_STORAGE_START]: {},
  // Окончание переноса обработанных видео-ресурсов и метаданных в Оперативное хранилище
  [ActionType.SYSTEM_MOVE_RESOURCES_TO_OPERATIVE_STORAGE_END]: {},
  // Начало процесса переноса ресурсов из Оперативного хранилища в Архивное
  [ActionType.SYSTEM_MOVE_RESOURCES_FROM_OPERATIVE_TO_ARCHIVE_STORAGE_START]: {},
  // Окончание процесса переноса ресурсов из Оперативного хранилища в Архивное
  [ActionType.SYSTEM_MOVE_RESOURCES_FROM_OPERATIVE_TO_ARCHIVE_STORAGE_END]: {},

  /* ----Внешние события по запросам СБО СОИ. ЭДО. ИНВ. ВИ---- */
  // Создание события инвентаризации
  [ActionType.SOI_EVENT_CREATE]: {
    loggedinUser: {
      key: 'SOI',
      subKeys: {
        eventId: 'id События',
        orderId: 'id Приказа',
        orderDate: 'Дата приказа',
        orderNumber: '№ приказа'
      }
    }
  },
  // Создание инвентаризационной описи и конференции IVA R
  [ActionType.SOI_AUDIT_OPEN]: {
    loggedinUser: {
      key: 'SOI',
      subKeys: {
        error: 'Ошибка',
        eventId: 'id инвентаризации',
        inventoryId: 'id инвентаризационной описи'
      }
    }
  },
  // Закрытие инвентаризационной описи и конференции IVA R
  [ActionType.SOI_AUDIT_CLOSE]: {},
  // Открытие конференции для инструктажа в IVA R
  [ActionType.SOI_BRIEFING_OPEN]: {},
  // Закрытие конференции для инструктажа в IVA R
  [ActionType.SOI_BRIEFING_CLOSE]: {},
  // Изменение состава участников события инвентаризации по запросу СБО СОИ
  [ActionType.SOI_EVENT_PARTICIPANTS_CHANGE]: {},
  // Проверка зарегистрированных в системе пользователей
  [ActionType.SOI_CHECK_USERS]: {}
};

// @TODO: remove
// const test = {
//   loginInput: 'Введенный логин',
//   addressBefore: 'Адрес до изменений',
//   addressAfter: 'Адрес после изменений',
//   admin: 'Администратор',
//   username: 'Пользователь',
//   name: 'ФИО',
//   department: 'Отдел',
//   createdUser: 'Созданный пользователь',
//   editedUser: 'Редактируемый пользователь',
//   roleBefore: 'Роль до изменений',
//   roleAfter: 'Роль после изменений',
//   videoFileName: 'Название видео-файла',
//   subtitlesFileName: 'Название файла мета-данных',
//   videoFileSize: 'размер видео-файла'
// };
