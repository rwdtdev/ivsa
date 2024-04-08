import bcrypt from 'bcryptjs';

import { UserSession } from '@/types/user';
import { generateToken, verifyToken } from './jwt';
import { NextRequest } from 'next/server';

export const generateAccessToken = (payload: UserSession): string => {
  if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not set');
  }

  if (!process.env.JWT_ACCESS_TOKEN_EXPIRATION) {
    throw new Error('ACCESS_TOKEN_EXPIRATION is not set');
  }

  return generateToken(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    process.env.JWT_ACCESS_TOKEN_EXPIRATION
  );
};

export const generateRefreshToken = (payload: UserSession): string => {
  if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
    throw new Error('JWT_REFRESH_TOKEN_SECRET is not set');
  }

  if (!process.env.JWT_REFRESH_TOKEN_EXPIRATION) {
    throw new Error('JWT_REFRESH_TOKEN_EXPIRATION is not set');
  }

  return generateToken(
    payload,
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    process.env.JWT_REFRESH_TOKEN_EXPIRATION
  );
};

export const verifyPassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const verifyAccessToken = (token: string) => {
  if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not set');
  }

  return verifyToken(token, process.env.JWT_ACCESS_TOKEN_SECRET);
};

export const isAuthorized = (request: NextRequest | Request) => {
  const authHeader =
    request.headers.get('authorization') || request.headers.get('Authorization');

  if (!authHeader) {
    return false;
  }

  const asviApiKey = process.env.ASVI_API_KEY;
  const ocrvApiKey = process.env.OCRV_API_KEY;

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');
  const apiKey = credentials[1];

  console.log('Credentials: ', credentials);
  console.log('ApiKey: ', apiKey);

  if (apiKey === ocrvApiKey || apiKey === asviApiKey) {
    return true;
  }

  return false;
};
