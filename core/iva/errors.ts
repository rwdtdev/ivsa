import { makeErrorDictionary } from '@/lib/problem-json';

export const { IvaRequestError, IvaConfigurationError } = makeErrorDictionary()({
  IvaRequestError: {
    type: 'urn:problem-type:iva-request-error',
    title: 'Ошибка при отправке запроса в IVA R',
    status: 400
  },
  IvaConfigurationError: {
    type: 'urn:problem-type:iva-configuration-error',
    title: 'Ошибка в конфигурации подключения к IVA R',
    status: 409
  }
});
