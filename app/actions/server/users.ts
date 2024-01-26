'use server';

import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import {
  UserService,
  createUser,
  deleteUser,
  getUsers,
  updateUser
} from '@/server/services/users';
import { SearchParams } from '@/types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { searchParamsSchema } from '@/lib/query-params-validation';

import Cache from 'node-cache';
import { UserView } from '@/types/user';

const cache = new Cache({
  checkperiod: 120
});

export async function createUserAction(formData: UserFormData & { password: string }) {
  try {
    await createUser(formData);
  } catch (err) {
    throw err;
  }

  redirect('/admin/users');
}

export async function updateUserAction(userId: string, formData: UserFormData) {
  try {
    await updateUser(userId, formData);
  } catch (err) {
    throw err;
  }

  redirect('/admin/users');
}

export async function deleteUserAction(id: string) {
  try {
    await deleteUser(id);
  } catch (err) {
    throw err;
  }

  revalidatePath('/admin/users');
}

export async function getUserByIdAction(id: string) {
  try {
    const cacheKey = `user_${id}`;

    let data = cache.get(cacheKey);

    if (!data) {
      const userService = new UserService();
      const data = await userService.getUserById(id);

      cache.set(cacheKey, data);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export async function getUsersAction(searchParams: SearchParams) {
  const { page, per_page, sort, title, status, priority, operator } =
    searchParamsSchema.parse(searchParams);

  // Fallback page for invalid page numbers
  const pageAsNumber = Number(page);
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  // Number of items per page
  const perPageAsNumber = Number(per_page);
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;
  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [column, order] = (sort?.split('.') as [
    keyof UserView | undefined,
    1 | 0 | undefined
  ]) ?? ['name', 1];

  return await getUsers({
    page: pageAsNumber,
    limit
  });

  try {
  } catch (err) {
    return { data: [], pagesCount: 0 };
  }
}
