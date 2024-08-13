import { ActionType, UserRole } from '@prisma/client';

export const fakeSystemEventItems = [
  // {
  //   id: '0',
  //   actionAt: '2024-11-09 20:04:24.683',
  //   actionType: ActionType.USER_CREATE,
  //   name: 'Харитонов Фёдор Сергеевич',
  //   ip: '192.168.1.21',
  //   details: {
  //     admin: {
  //       username: 'HaritonovFS',
  //       department: 'Отдел 168'
  //     },
  //     createdUser: {
  //       username: 'IvanovAD',
  //       name: 'Иванов Александр Дмитриевич'
  //     }
  //   }
  // },
  {
    id: '0',
    actionAt: '2024-11-01 20:04:24.683',
    actionType: ActionType.USER_CREATE,
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      adminUsername: 'HaritonovFS',
      adminDepartment: 'Отдел 168',
      createdUsername: 'IvanovAD',
      createdName: 'Иванов Александр Дмитриевич'
    }
  },
  {
    id: '1',
    actionAt: '2024-11-01 21:05:24.683',
    actionType: ActionType.USER_EDIT,
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      adminUsername: 'HaritonovFS',
      adminDepartment: 'Отдел 168',
      editedUserUserName: 'IvanovAD',
      editedUserName: 'Иванов Александр Дмитриевич'
      // whatElse: 'указывать поля до и поля после редактирования'
      // доработать
    }
  },
  {
    id: '2',
    actionAt: '2024-11-02 11:05:24.683',
    actionType: ActionType.USER_CHANGE_ROLE,
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      adminUsername: 'HaritonovFS',
      adminDepartment: 'Отдел 168',
      editedUserUsername: 'IvanovAD',
      editedUserName: 'Иванов Александр Дмитриевич',
      roleBefore: UserRole.USER,
      roleAfter: UserRole.ADMIN
    }
  },
  {
    id: '3',
    actionAt: '2024-11-03 11:05:24.683',
    actionType: ActionType.USER_LOGIN,
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      username: 'HaritonovFS',
      department: 'Отдел 168',
      status: 'Успешно'
    }
  },
  {
    id: '4',
    actionAt: '2024-11-04 11:05:24.683',
    actionType: ActionType.USER_LOGIN,
    name: 'Нет данных',
    ip: '192.168.1.21',
    details: {
      // т.к. это может и не быть логином, а любая строка, может переименовать как-то (loginInput)?
      username: 'HaritonovasdfADSF ',
      department: 'Нет данных', //- может и не быть если логин не соответствует ни одному зарегистрированному логину,
      status: 'Неудачная попытка'
    }
  },
  {
    id: '5',
    actionAt: '2024-11-05 11:05:24.683',
    actionType: ActionType.USER_LOGOUT,
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      username: 'HaritonovFS',
      department: 'Отдел 168'
    }
  },
  {
    id: '6',
    actionAt: '2024-11-06 11:05:24.683',
    actionType: ActionType.USER_DOWNLOAD_FILE,
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      username: 'HaritonovFS',
      department: 'Отдел 168',
      videoFileName: 'видео по описи № 22 от 12.05.2024', // возможно лучше идентификатор файла т.е. по названию сложно будет найти файл в хранилище
      subtitlesFileName: 'метаданные к видео по описи № 22 от 12.05.2024', // возможно лучше идентификатор файла т.е. по названию сложно будет найти файл в хранилище
      videoFileSize: '1300 MB'
    }
  }
  // {
  //   id: '7',
  //   actionAt: '2024-11-11 11:05:24.683',
  //   actionType: 'addRecord',
  //   name: null,
  //   ip: null,
  //   details: {}
  // },
  // {
  //   id: '8',
  //   actionAt: '2024-11-11 11:05:24.683',
  //   actionType: 'editRecord',
  //   name: 'Иванов Александр Дмитриевич',
  //   ip: '192.168.3.12',
  //   details: {
  //     addressBefore: 'Парковая д.17',
  //     addressAfter: 'Лесная д.8'
  //   }
  // }
];
