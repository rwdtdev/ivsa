'use server';

import Cache from 'node-cache';
import { unstable_noStore as noStore } from 'next/cache';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import { SearchParams } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { searchParamsSchema } from '@/lib/query-params-validation';

import UserService from '@/server/services/users';
import { UserView } from '@/types/user';
import { PaginatedResponse } from '@/server/types';
import { UserRole, UserStatus } from '@prisma/client';
import { UserCreateData } from '@/server/services/users/types';

const cache = new Cache({ checkperiod: 120 });

export async function createUserAction(formData: UserFormData): Promise<any> {
  const userService = new UserService();

  try {
    // TODO Refactor type casting
    await userService.create(formData as UserCreateData);
  } catch (error) {
    console.debug(error);
    return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function updateUserAction(id: string, formData: UserFormData) {
  const userService = new UserService();

  try {
    await userService.update(id, formData);
  } catch (error) {
    console.debug(error);
    return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function getUserByIdAction(id: string): Promise<UserView | null> {
  try {
    const cacheKey = `user_${id}`;

    let cachedUser = cache.get<UserView>(cacheKey) || null;

    if (!cachedUser) {
      const userService = new UserService();

      cachedUser = await userService.getById(id);

      cache.set(cacheKey, cachedUser);
    }

    return cachedUser;
  } catch (error) {
    console.debug(error);
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
    const { page, per_page, status, role, search, organisation, department } =
      searchParamsSchema.parse(searchParams);

    // Fallback page for invalid page numbers
    const pageAsNumber = Number(page);
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    // Number of items per page
    const perPageAsNumber = Number(per_page);
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
    // Number of items to skip
    // const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    // const [column, order] = (sort?.split('.') as [
    //   keyof UserView | undefined,
    //   SortOrder
    // ]) ?? ['title', 'asc'];

    const statuses = (status?.split('.') as UserStatus[]) ?? [];
    const roles = (role?.split('.') as UserRole[]) ?? [];
    const organisationsIds = (organisation?.split('.') as string[]) ?? [];
    const departmentsIds = (department?.split('.') as string[]) ?? [];

    const userService = new UserService();

    return await userService.getAll({
      searchTerm: search,
      limit,
      page: fallbackPage,
      query: {
        ...(statuses.length > 0 && { statuses }),
        ...(roles.length > 0 && { roles }),
        ...(organisationsIds.length > 0 && { organisationsIds }),
        ...(departmentsIds.length > 0 && { departmentsIds })
      }
    });
  } catch (error) {
    console.debug(error);
    return {
      items: [],
      pagination: { pagesCount: 0 }
    };
  }
}
