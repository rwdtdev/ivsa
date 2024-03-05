export default {
  ValidationError: {
    type: 'urn:problem-type:validation-error',
    title: 'Ошибка валидации входных параметров',
    status: 400
  },
  UnexpectedParamsError: {
    type: 'urn:problem-type:unexpected-params-error',
    title: 'Ресурс не принимает параметры',
    status: 400
  },
  BadRequestError: {
    type: 'urn:problem-type:unexpected-params-error',
    title: 'Некорректные параметры',
    status: 400
  },
  UnauthorizedError: {
    type: 'urn:problem-type:unauthorized-error',
    title: 'Для доступа к запрашиваемому ресурсу требуется аутентификация',
    status: 401
  },
  ForbiddenError: {
    type: 'urn:problem-type:forbidden-error',
    title: 'Доступ запрещен',
    status: 403
  },
  NotFoundError: {
    type: 'urn:problem-type:not-found-error',
    title: 'Сущность не найдена',
    status: 404
  },
  UrlNotFoundError: {
    type: 'urn:problem-type:url-not-found-error',
    title: 'Страница не найдена',
    status: 404
  },
  ServerError: {
    type: 'urn:problem-type:server-error',
    title: 'Внутренняя ошибка сервера',
    status: 500
  }
};
