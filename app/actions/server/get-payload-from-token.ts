'use server';

import { JwtSecret } from '@/constants/jwt';
import { verify } from 'jsonwebtoken';
import { useSession } from 'next-auth/react';

export async function getPayload(token: string): Promise<string | null> {
  let payload = null;

  verify(token, JwtSecret, (err, decoded) => {
    if (err || !decoded) {
      return;
    }

    if (typeof decoded === 'string') {
      payload = decoded;
    } else {
      payload = decoded.username;
    }

    useSession;
  });

  return payload;
}
