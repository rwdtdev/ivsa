import { toErrorWithMessage } from '@/lib/helpers';
import { getIvaDomainId } from '../helpers';
import { ivaRequest } from '../request';
import { IvaUserCreateData } from '../types';
import { IvaRequestError } from './errors';

export const find = async (
  searchString?: string,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    const query = {
      searchString,
      limit: limit.toString(),
      offset: offset.toString(),
      domainId: getIvaDomainId()
    };

    const users = await ivaRequest('/integration/users', { query });

    return users;
  } catch (error) {
    // @TODO: check api reasons and statuses
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const create = async (data: IvaUserCreateData) => {
  try {
    const user = await ivaRequest('/integration/users', {
      method: 'POST',
      data: { ...data, domainId: getIvaDomainId() }
    });

    return user;
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const update = async (id: string, data: any) => {
  try {
    const updatedUser = await ivaRequest(`/integration/users/${id}`, {
      method: 'PATCH',
      data
    });

    return updatedUser;
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const remove = async (id: string) => {
  try {
    await ivaRequest(`/integration/users/${id}`, { method: 'DELETE' });
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};
