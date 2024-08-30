import * as auth from '@/lib/auth';
import prisma from '@/core/prisma';
import { UserCredentials } from '@/app/types';
import { UserSession } from '@/types/user';
import { UnauthorizedError } from '@/lib/problem-json';
import { blockUserAction } from '@/app/actions/server/users';
import { ActionType } from '@prisma/client';

let globalCounter = 0;

export const login = async ({ username, password }: UserCredentials) => {
  if (!username || !password) {
    throw new UnauthorizedError({ detail: 'Missing username or password' });
  }
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw new UnauthorizedError({ detail: 'Invalid username or password' });
  } else {
    if (await auth.verifyPassword(password, user.password)) {
      const session = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        phone: user.phone,
        status: user.status,
        organisationId: user.organisationId,
        departmentId: user.departmentId
      } as UserSession;

      const accessToken = auth.generateAccessToken(session);
      const refreshToken = auth.generateRefreshToken(session);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
      });

      return { ...session, accessToken, refreshToken };
    } else {
      if (globalCounter >= 4) {
        blockUserAction({
          id: user.id,
          type: ActionType.USER_BLOCK_BY_LIMIT_LOGIN_ATTEMPTS
        });
      } else {
        globalCounter++;
      }

      throw new UnauthorizedError({ detail: 'Invalid email or password' });
    }
  }
};
