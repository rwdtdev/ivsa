import { makeErrorDictionary } from '@/lib/problem-json';

export const { IvaRequestError } = makeErrorDictionary()({
  IvaRequestError: {
    type: 'urn:problem-type:iva-request-error',
    title: 'Ошибка при отправке запроса в IVA R',
    status: 400
  }
});
