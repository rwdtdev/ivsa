import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  UserNotFoundError,
  CreateIvaUserError,
  UserWithEmailAlreadyExistError,
  UserWithUsernameAlreadyExistError,
  UserWithTabelNumberAlreadyExistError
} = makeErrorDictionary()({
  CreateIvaUserError: {
    type: 'urn:problem-type:create-iva-user-error',
    title: 'Произошла ошибка',
    status: 400,
    userMessage: 'Ошибка при создании пользователя в IVA R'
  },
  UserNotFoundError: {
    type: 'urn:problem-type:user-not-found-error',
    title: 'Произошла ошибка',
    status: 404
  },
  UserWithEmailAlreadyExistError: {
    type: 'urn:problem-type:user-with-email-already-exist-error',
    title: 'Произошла ошибка',
    status: 409,
    userMessage: 'Пользователь с таким почтовым адресом уже зарегистрирован в IVA R'
  },
  UserWithUsernameAlreadyExistError: {
    type: 'urn:problem-type:user-with-username-already-exist-error',
    title: 'Произошла ошибка',
    status: 409,
    userMessage: 'Пользовать с таким именем учетной записи уже зарегистрирован в IVA R'
  },
  UserWithTabelNumberAlreadyExistError: {
    type: 'urn:problem-type:user-with-tabel-number-already-exist-error',
    title: 'Произошла ошибка',
    status: 409,
    userMessage: 'Пользовать с таким табельным номером уже зарегистрирован в IVA R'
  }
});
