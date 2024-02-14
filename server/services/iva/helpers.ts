import CryptoJS from 'crypto-js';

export const getJWTToken = async () => {
  const appId = process.env.IVA_APP_ID;
  const appSecret = process.env.IVA_APP_SECRET;
  const timestamp = Math.ceil(new Date().getTime() / 1000 - 1); // subtract 1 second to avoid token outdated error

  if (!appId || appId.trim() === '') {
    throw new Error('appId is null or empty');
  }

  if (!appSecret || appSecret.trim() === '') {
    throw new Error('appSecret is null or empty');
  }

  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { sub: appId, iat: timestamp };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  const signature = CryptoJS.HmacSHA256(encodedHeader + '.' + encodedPayload, appSecret)
    .toString(CryptoJS.enc.Base64)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const token = `${encodedHeader}.${encodedPayload}.${signature}`;

  return token;
};

export const getIvaDomainId = (): string => {
  const domainId = process.env.IVA_APP_DOMAIN_ID;

  if (!domainId || domainId.trim() === '') {
    throw new Error(
      'Not set IVA_APP_DOMAIN_ID option in .env file not be a null or empty'
    );
  }

  return domainId;
};
