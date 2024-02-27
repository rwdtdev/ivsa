import { makeErrorDictionary } from '@/lib/problem-json';
import errors from '@/lib/problem-json';

export const { IvaUserAlreadyExist, CreateIvaUserError } = makeErrorDictionary()({
  ...errors,
  IvaUserAlreadyExist: {
    type: 'urn:problem-type:iva-user-already-exist',
    title: 'Пользовать уже зарегистрирован в IVA R',
    status: 409
  },
  CreateIvaUserError: {
    type: 'urn:problem-type:create-iva-user-error',
    title: 'Ошибка создания пользователя в IVA R',
    status: 400
  }
});
