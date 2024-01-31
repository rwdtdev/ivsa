import bcrypt from 'bcryptjs';

import { UserSession } from '@/types/user';
import { generateToken, verifyToken } from './jwt';

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
