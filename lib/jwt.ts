import { UserSession } from '@/types/user';
import { sign, verify } from 'jsonwebtoken';

export const generateToken = <T extends Object | string>(
  payload: T,
  secret: string,
  expiresIn: string | number | undefined
) => {
  return sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): Promise<UserSession> => {
  return new Promise((resolve, reject) => {
    try {
      verify(token, secret, (err, decoded) => {
        if (err || !decoded) {
          return reject(err);
        }
        const userDecoded = decoded as UserSession;
        const userSession: UserSession = {
          id: userDecoded.id,
          email: userDecoded.email,
          role: userDecoded.role,
          name: userDecoded.name,
          status: userDecoded.status,
          organisationId: userDecoded.organisationId,
          departmentId: userDecoded.departmentId,
          phone: userDecoded.phone,
          username: userDecoded.username
        };
        resolve(userSession);
      });
    } catch (err) {
      reject(err);
    }
  });
};
