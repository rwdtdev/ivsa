import _ from 'underscore';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { ServerError, ValidationError } from './problem-json';
import ProblemJson from './problem-json/ProblemJson';
import { createLogger } from './logger';

const logger = createLogger('error');

function map(
  err: ProblemJson | Error | z.ZodError | any,
  allowedErrors: any[],
  UnknownProductionError: any,
  UnknownDevelopmentError: any,
  env: string
) {
  const isAllowed = _(allowedErrors).some((E) => err instanceof E);

  if (isAllowed) return err;

  if (err instanceof z.ZodError) {
    return new ValidationError({
      invalidParams: [...err.issues].map(({ message, ...issue }) => ({
        ...issue,
        ...(message && !_.isEmpty(message) && { message })
      }))
    });
  }

  if (env === 'production' && err.status === 500) {
    return new UnknownProductionError();
  }

  return err instanceof Error
    ? new UnknownDevelopmentError({ detail: err.message, stack: err.stack })
    : new UnknownDevelopmentError({ detail: err });
}

export function getUnknownErrorText(error: any) {
  if (error instanceof ProblemJson) {
    return error.title;
  }

  return error.message || null;
}

export function getErrorResponse(
  originalErr: ProblemJson | Error | z.ZodError | any,
  request: NextRequest | Request,
  allowedErrors = [ProblemJson],
  UnknownProductionError = ServerError,
  UnknownDevelopmentError = ServerError,
  env = process.env.NODE_ENV
) {
  const requestId = request.headers.get('RequestId');

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
          status: err.status,
          instance: err.instance,
          ...(err.invalidParams && { invalidParams: err.invalidParams }),
          ...(requestId && { requestId })
        }
      : { ...err, ...(requestId && { requestId }) };

  logger.error(err);

  return NextResponse.json(formattedErrorByEnv, {
    status: formattedErrorByEnv.status,
    headers: {
      'Content-Type': 'application/problem+json'
    }
  });
}

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}
