import * as auth from '@/lib/auth';
import prisma from '@/server/services/prisma';
import { UserCredentials } from '@/app/types';
import { UserSession } from '@/types/user';
import ApiError from '@/server/utils/error';

export const login = async ({ username, password }: UserCredentials) => {
  if (!username || !password) {
    throw new ApiError('Missing username or password', 400);
  }

  const user = await prisma.user.findFirst({ where: { username } });

  if (!user) {
    throw new ApiError('Invalid username or password', 401);
  } else {
    if (await auth.verifyPassword(password, user.password)) {
      const session: UserSession = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        roles: user.roles,
        phone: user.phone,
        status: user.status,
        organisationId: user.organisationId,
        departmentId: user.departmentId
      };

      const accessToken = auth.generateAccessToken(session);
      const refreshToken = auth.generateRefreshToken(session);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
      });

      return { ...session, accessToken, refreshToken };
    } else {
      throw new ApiError('Invalid email or password', 401);
    }
  }
};
