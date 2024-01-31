'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import { UserService, createUser, updateUser } from '@/server/services/users';
import { SearchParams } from '@/types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { searchParamsSchema } from '@/lib/query-params-validation';

import Cache from 'node-cache';
import { UserView } from '@/types/user';
import { PaginatedResponse } from '@/server/types';
import { SortOrder } from '@/constants/data';
import { User } from '@prisma/client';

const cache = new Cache({
  checkperiod: 120
});

export async function createUserAction(formData: UserFormData) {
  try {
    await createUser(formData);
  } catch (err) {
    throw err;
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function updateUserAction(userId: string, formData: UserFormData) {
  try {
    await updateUser(userId, formData);
  } catch (err) {
    throw err;
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
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
    console.debug(err);
    return null;
  }
}

export async function getUsersAction(
  searchParams: SearchParams
): Promise<
  PaginatedResponse<UserView> | { items: []; pagination: { pagesCount: number } }
> {
  noStore();
  try {
    const { page, per_page, sort, title, status, role, operator, search } =
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
      SortOrder
    ]) ?? ['title', 'asc'];

    // @TODO Доделать сортировку столбцов
    const statuses = (status?.split('.') as User['status'][]) ?? [];
    const roles = (role?.split('.') as User['role'][]) ?? [];

    const userService = new UserService();

    return await userService.getUsers({
      searchTerm: search,
      limit,
      page: fallbackPage
    });
  } catch (err) {
    console.log(err);
    return {
      items: [],
      pagination: {
        pagesCount: 0
      }
    };
  }
}
