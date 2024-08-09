import { UserRole } from '@prisma/client';

export const fakeSystemEventItems = [
  {
    id: '0',
    actionAt: '2024-11-09 20:04:24.683',
    actionType: 'createUser',
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      admin: {
        username: 'HaritonovFS',
        department: 'Отдел 168'
      },
      createdUser: {
        username: 'IvanovAD',
        name: 'Иванов Александр Дмитриевич'
      }
    }
  },
  {
    id: '1',
    actionAt: '2024-11-10 21:05:24.683',
    actionType: 'editUser',
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      admin: {
        username: 'HaritonovFS',
        department: 'Отдел 168'
      },
      editedUser: {
        username: 'IvanovAD',
        name: 'Иванов Александр Дмитриевич'
        // whatElse: 'указывать поля до и поля после редактирования'
        // доработать
      }
    }
  },
  {
    id: '2',
    actionAt: '2024-11-11 11:05:24.683',
    actionType: 'changeRole',
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      admin: {
        username: 'HaritonovFS',
        department: 'Отдел 168'
      },
      editedUser: {
        username: 'IvanovAD',
        name: 'Иванов Александр Дмитриевич',
        roleBefore: UserRole.USER,
        roleAfter: UserRole.ADMIN
      }
    }
  },
  {
    id: '3',
    actionAt: '2024-11-11 11:05:24.683',
    actionType: 'authSuccess',
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      username: 'HaritonovFS',
      department: 'Отдел 168'
    }
  },
  {
    id: '4',
    actionAt: '2024-11-11 11:05:24.683',
    actionType: 'authError',
    name: 'unknown',
    ip: '192.168.1.21',
    details: {
      // т.к. это может и не быть логином, а любая строка, может переименовать как-то (loginInput)?
      loginInput: 'HaritonovasdfADSF '
      // department: 'Отдел 168' - может и не быть если логин не соответствует ни одному зарегистрированному логину
    }
  },
  {
    id: '5',
    actionAt: '2024-11-11 11:05:24.683',
    actionType: 'logout',
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      username: 'HaritonovFS',
      department: 'Отдел 168'
    }
  },
  {
    id: '6',
    actionAt: '2024-11-11 11:05:24.683',
    actionType: 'download',
    name: 'Харитонов Фёдор Сергеевич',
    ip: '192.168.1.21',
    details: {
      username: 'HaritonovFS',
      department: 'Отдел 168',
      videoFileName: 'видео по описи № 22 от 12.05.2024', // возможно лучше идентификатор файла т.е. по названию сложно будет найти файл в хранилище
      subtitlesFileName: 'метаданные к видео по описи № 22 от 12.05.2024', // возможно лучше идентификатор файла т.е. по названию сложно будет найти файл в хранилище
      videoFileSize: '1300 MB'
    }
  },
  {
    id: '7',
    actionAt: '2024-11-11 11:05:24.683',
    actionType: 'addRecord',
    name: null,
    ip: null,
    details: {}
  },
  {
    id: '8',
    actionAt: '2024-11-11 11:05:24.683',
    actionType: 'editRecord',
    name: 'Иванов Александр Дмитриевич',
    ip: '192.168.3.12',
    details: {
      addressBefore: 'Парковая д.17',
      addressAfter: 'Лесная д.8'
    }
  }
];
