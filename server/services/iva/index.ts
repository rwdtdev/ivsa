import { IvaUserCreateData } from "./types";
import CryptoJS from 'crypto-js';

export const getServerStatus = async () => {
  // get server base url from IVA_API_URL env variable
  const baseUrl = process.env.IVA_API_URL;
  const res = await fetch(`${baseUrl}/public/system/info`, { cache: "no-cache" });
  const data = await res.json();
  return data;
}

export const getJWTToken = async () => {
  const appId = process.env.IVA_APP_ID;
  const appSecret = process.env.IVA_APP_SECRET;
  const timestamp = Math.ceil((new Date().getTime() / 1000) - 1); // subtract 1 second to avoid token outdated error

  if (!appId || appId.trim() === "") {
    throw new Error("appId is null or empty");
  }

  if (!appSecret || appSecret.trim() === "") {
    throw new Error("appSecret is null or empty");
  }


  const header = { "alg": "HS256", "typ": "JWT" };
  const payload = { "sub": appId, "iat": timestamp };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  const signature = CryptoJS.HmacSHA256(encodedHeader + "." + encodedPayload, appSecret).toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const token = `${encodedHeader}.${encodedPayload}.${signature}`;

  return token;
}


export const findIvaUsers = async (searchString: string, limit: number = 20, offset: number = 0) => {
  try {
    const url = new URL(`${process.env.IVA_API_URL}/integration/users`);
    const domainId = process.env.IVA_APP_DOMAIN_ID;
    if (!domainId || domainId.trim() === "") {
      throw new Error("domainId is null or empty");
    }
    const params = {
      searchString,
      domainId,
      limit: limit.toString(),
      offset: offset.toString()
    };
    url.search = new URLSearchParams(params).toString();

    const token = await getJWTToken();
    const res = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = JSON.parse(await res.text());
      return data;
    } else {
      throw new Error("Response is not in JSON format");
    }
  } catch (error) {
    throw new Error(`Failed to fetch Iva users: ${error}`);
  }
}

export const createIvaUser = async (data: IvaUserCreateData) => {
  try {
    const url = new URL(`${process.env.IVA_API_URL}/integration/users`);
    const domainId = process.env.IVA_APP_DOMAIN_ID;
    if (!domainId || domainId.trim() === "") {
      throw new Error("domainId is null or empty");
    }
    const token = await getJWTToken();
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ ...data, domainId })
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = JSON.parse(await res.text());
      return data;
    } else {
      throw new Error("Response is not in JSON format");
    }
  } catch (error) {
    throw new Error(`Failed to create Iva user: ${error}`);
  }
}
