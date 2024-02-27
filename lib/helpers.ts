import _ from 'underscore';
import { NextResponse } from 'next/server';
import errors from './problem-json';
import ProblemJson from './problem-json/ProblemJson';

function map(
  err: ProblemJson | Error | any,
  allowedErrors: any[],
  UnknownProductionError: any,
  UnknownDevelopmentError: any,
  env: string
) {
  const isAllowed = _(allowedErrors).some((E) => err instanceof E);

  if (isAllowed) return err;

  if (env === 'production') {
    return new UnknownProductionError();
  }

  return err instanceof Error
    ? new UnknownDevelopmentError({ detail: err.message, stack: err.stack })
    : new UnknownDevelopmentError({ detail: err });
}

export function getErrorResponse(
  originalErr: ProblemJson | Error | any,
  allowedErrors = [ProblemJson],
  UnknownProductionError = errors.ServerError,
  UnknownDevelopmentError = errors.ServerError,
  env = process.env.NODE_ENV
) {
  const err = map(
    originalErr,
    allowedErrors,
    UnknownProductionError,
    UnknownDevelopmentError,
    env
  );

  const formattedErrorByEnv =
    env === 'production'
      ? {
          type: err.type,
          title: err.title,
          detail: err.detail,
          instance: err.instance
        }
      : err;

  // @TODO: поменять на нормальный лог
  console.error(formattedErrorByEnv);

  return NextResponse.json(formattedErrorByEnv, { status: formattedErrorByEnv.status });
}
