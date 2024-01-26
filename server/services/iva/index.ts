import { IvaUserCreateData } from "./types";

export const getServerStatus = async () => {
  // get server base url from IVA_API_URL env variable
  const baseUrl = process.env.IVA_API_URL;
  const res = await fetch(`${baseUrl}/public/system/info`, { cache: "no-cache" });
  const data = await res.json();
  return data;
}

export const createIvaUser = async (data: IvaUserCreateData) => {

}
