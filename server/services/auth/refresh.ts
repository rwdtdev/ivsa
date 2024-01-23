import ApiError from '@/server/utils/error';
import { verifyToken } from '@/lib/jwt';
import { generateAccessToken } from '@/lib/auth';
import { UserSession } from '@/types/user';

export const refresh = async (refreshToken?: string): Promise<string> => {
  if (!refreshToken) {
    throw new ApiError('Missing refresh token', 400);
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
        throw new ApiError('Invalid refresh token', 401);
      } else if (user.refreshToken != refreshToken) {
        throw new ApiError('Refresh token mismatch', 401);
      } else {
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

        return generateAccessToken(session);
      }
    } else {
      throw new ApiError('Invalid refresh token', 500);
    }
  } catch (err) {
    console.log(err);
    throw new ApiError('Invalid refresh token', 401);
  }
};
