import * as helpers from './helpers';

type IvaRequestOptions = {
  data?: Record<string, any>;
  query?: Record<string, any>;
  method?: string;
};

export const ivaRequest = async (
  path: string,
  options?: IvaRequestOptions
): Promise<any> => {
  const token = await helpers.getJWTToken();
  const url = new URL(`${process.env.IVA_API_URL}${path}`);

  if (options?.query) {
    url.search = new URLSearchParams({ ...options.query }).toString();
  }

  try {
    const response = await fetch(url.toString(), {
      method: options?.method ?? 'GET',
      headers: {
        ...(options?.data && { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${token}`
      },
      ...(options?.data && { body: JSON.stringify({ ...options.data }) })
    });

    if (!response.ok) {
      return await response.text();
    }

    const contentType = response.headers.get('content-type');
    console.log(contentType);

    if (contentType && contentType.includes('application/json')) {
      const data = JSON.parse(await response.text());
      return data;
    } else {
      return;
      // throw new Error('Response is not in JSON format');
    }
  } catch (error) {
    throw error;
  }
};
