import { verifyToken } from '@/lib/jwt';
import { generateAccessToken } from '@/lib/auth';
import { UserSession } from '@/types/user';
import { BadRequestError, ServerError, UnauthorizedError } from '@/lib/problem-json';

export const refresh = async (refreshToken?: string): Promise<string> => {
  if (!refreshToken) {
    throw new BadRequestError({ detail: 'Missing refresh token' });
  }

  try {
    const decoded = await verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string
    );

    if (decoded) {
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.id,
          username: decoded.username
        }
      });

      if (!user) {
        throw new UnauthorizedError({ detail: 'Invalid refresh token' });
      } else if (user.refreshToken != refreshToken) {
        throw new UnauthorizedError({ detail: 'Refresh token mismatch' });
      } else {
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

        return generateAccessToken(session);
      }
    } else {
      throw new ServerError({ detail: 'Invalid refresh token' });
    }
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError({ detail: 'Invalid refresh token' });
  }
};
