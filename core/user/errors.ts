import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  BlockIvaUserError,
  UnblockIvaUserError,
  UserNotFoundError,
  CreateIvaUserError,
  UserNotRegisteredInIvaError,
  UserWithEmailAlreadyExistError,
  UserWithUsernameAlreadyExistError,
  UserWithTabelNumberAlreadyExistError
} = makeErrorDictionary()({
  UnblockIvaUserError: {
    type: 'urn:problem-type:unblock-iva-user-error',
    title: 'Произошла ошибка',
    status: 400,
    userMessage: 'Ошибка при снятии блокировки с пользователя в IVA R'
  },
  BlockIvaUserError: {
    type: 'urn:problem-type:block-iva-user-error',
    title: 'Произошла ошибка',
    status: 400,
    userMessage: 'Ошибка при блокировки пользователя в IVA R'
  },
  CreateIvaUserError: {
    type: 'urn:problem-type:create-iva-user-error',
    title: 'Произошла ошибка',
    status: 400,
    userMessage: 'Ошибка при создании пользователя в IVA R'
  },
  UserNotRegisteredInIvaError: {
    type: 'urn:problem-type:user-not-registered-error',
    title: 'Произошла ошибка',
    status: 400,
    userMessage: 'Пользователя не зарегистрирован в IVA R'
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
    userMessage: 'Пользователь с таким почтовым адресом уже зарегистрирован в ASVI'
  },
  UserWithUsernameAlreadyExistError: {
    type: 'urn:problem-type:user-with-username-already-exist-error',
    title: 'Произошла ошибка',
    status: 409,
    userMessage: 'Пользовать с таким именем учетной записи уже зарегистрирован в ASVI'
  },
  UserWithTabelNumberAlreadyExistError: {
    type: 'urn:problem-type:user-with-tabel-number-already-exist-error',
    title: 'Произошла ошибка',
    status: 409,
    userMessage: 'Пользовать с таким табельным номером уже зарегистрирован в ASVI'
  }
});
