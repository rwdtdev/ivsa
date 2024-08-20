'use server';

import Cache from 'node-cache';
import { unstable_noStore as noStore } from 'next/cache';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import { SearchParams } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { searchParamsSchema } from '@/lib/query-params-validation';

import { UserService } from '@/core/user/UserService';
import { UserView } from '@/types/user';
import { PaginatedResponse } from '@/types';
import { ActionStatus, ActionType, User, UserRole, UserStatus } from '@prisma/client';
import { UserCreateData } from '@/core/user/types';
import { UserManager } from '@/core/user/UserManager';
import { IvaService } from '@/core/iva/IvaService';
import { DepartmentService } from '@/core/department/DepartmentService';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { OrganisationService } from '@/core/organisation/OrganisationService';
import { SortOrder } from '@/constants/data';
import { ActionService } from '@/core/action/ActionService';
import { getUnknownErrorText } from '@/lib/helpers';
import { MonitoringData } from '@/components/forms/user-form';

const cache = new Cache({ checkperiod: 120 });

export async function createUserAction(
  formData: UserFormData,
  monitoringData: MonitoringData
): Promise<any> {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new DepartmentService(),
    new ParticipantService(),
    new OrganisationService()
  );
  const actionService = new ActionService();

  try {
    // TODO Refactor type casting
    await userManager.createUser(formData as UserCreateData);
    await actionService.add({
      ...monitoringData,
      type: ActionType.USER_CREATE,
      status: ActionStatus.SUCCESS,
      details: {
        ...monitoringData.details,
        createdUserName: formData.username,
        createdName: formData.name
      }
    });
  } catch (error) {
    await actionService.add({
      type: ActionType.USER_CREATE,
      status: ActionStatus.ERROR,
      ...monitoringData,
      details: {
        ...monitoringData.details,
        error: getUnknownErrorText(error),
        createdUserName: formData.username,
        createdName: formData.name
      }
    });
    console.debug(error);
    return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function updateUserAction(
  id: string,
  formData: UserFormData,
  monitoringData: MonitoringData
) {
  const actionService = new ActionService();
  const userService = new UserService();

  try {
    await userService.update(id, formData);
    await actionService.add({
      type: ActionType.USER_EDIT,
      status: ActionStatus.SUCCESS,
      ...monitoringData
    });
  } catch (error) {
    await actionService.add({
      type: ActionType.USER_EDIT,
      status: ActionStatus.ERROR,
      ...monitoringData,
      details: {
        ...monitoringData.details,
        error: getUnknownErrorText(error)
      }
    });
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
    const { page, per_page, status, role, search, organisation, department, sort } =
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
    const [sortBy, sortDirection] = (sort?.split('.') as [keyof User, SortOrder]) ?? [
      'name',
      'asc'
    ];

    const statuses = (status?.split('.') as UserStatus[]) ?? [];
    const roles = (role?.split('.') as UserRole[]) ?? [];
    const organisationsIds = (organisation?.split('.') as string[]) ?? [];
    const departmentsIds = (department?.split('.') as string[]) ?? [];

    const userService = new UserService();

    return await userService.getAll({
      searchTerm: search,
      limit,
      page: fallbackPage,
      filter: {
        ...(statuses.length > 0 && { statuses }),
        ...(roles.length > 0 && { roles }),
        ...(organisationsIds.length > 0 && { organisationsIds }),
        ...(departmentsIds.length > 0 && { departmentsIds })
      },
      sort: {
        by: sortBy,
        direction: sortDirection
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

export async function IsBlocked(username: string) {
  const userService = new UserService();

  const user = await userService.getBy({ username });

  return user.status === UserStatus.BLOCKED;
}

export async function blockUserAction(id: string) {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new DepartmentService(),
    new ParticipantService(),
    new OrganisationService()
  );

  try {
    await userManager.blockUser(id);
  } catch (error) {
    console.debug(error);
    return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
  }
}

export async function unblockUserAction(id: string) {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new DepartmentService(),
    new ParticipantService(),
    new OrganisationService()
  );

  try {
    await userManager.unblockUser(id);
  } catch (error) {
    console.debug(error);
    return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
  }
}

export async function loginAction(
  monitoringData: any,
  status: ActionStatus,
  error?: string
) {
  const actionService = new ActionService();
  const userService = new UserService();

  const user = monitoringData.username
    ? await userService.getBy({ username: monitoringData.username })
    : undefined;

  if (status === ActionStatus.SUCCESS) {
    await actionService.add({
      type: ActionType.USER_LOGIN,
      initiator: user?.name || 'Неизвестный пользователь',
      status,
      ip: monitoringData.ip
    });
  }

  if (status === ActionStatus.ERROR) {
    await actionService.add({
      type: ActionType.USER_LOGIN,
      ip: monitoringData.ip,
      initiator: user?.name || 'Неизвестный пользователь',
      status,
      details: { error }
    });
  }
}
