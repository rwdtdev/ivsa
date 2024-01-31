import { JwtPayload } from 'jsonwebtoken';
import { UserSession } from './user';
import { Session } from 'next-auth';

export type JwtCallbackResult = {
  accessToken: string;
  refreshToken: string;
  user: UserSession;
  error?: string;
};

export type NextAuthSession = Session & {
  user: UserSession;
  accessToken: string;
  error: string;
};

export type UserWithTokens = UserSession & {
  accessToken: string;
  refreshToken: string;
};

export type JwtCallbackOptions = {
  token: JwtPayload;
  user: UserWithTokens;
};

export type SessionCallbackOptions = {
  session: NextAuthSession;
  token: JwtCallbackResult;
};

export type AuthorizedUser = UserSession & {
  accessToken: string;
  refreshToken: string;
};
