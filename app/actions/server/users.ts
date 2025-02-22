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
import { UserManager } from '@/core/user/UserManager';
import { IvaService } from '@/core/iva/IvaService';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { SortOrder } from '@/constants/data';
import { ActionService } from '@/core/action/ActionService';
import { getUnknownErrorText } from '@/lib/helpers';
import { getMonitoringInitData } from '@/lib/getMonitoringInitData';
import { MonitoringDetails } from '@/core/action/types';
import { AccountExpiration, UserRoles } from '@/constants/mappings/prisma-enums';

const cache = new Cache({ checkperiod: 120 });

export async function createUserAction(formData: UserFormData): Promise<any> {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new ParticipantService()
  );
  const actionService = new ActionService();
  const { ip, initiator, initiatorName } = await getMonitoringInitData();

  try {
    await userManager.createUser({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      divisionId: formData.divisionId || null,
      role: formData.role,
      status: formData.status,
      tabelNumber: formData.tabelNumber,
      password: formData.password as string,
      expiresAt: formData.expiresAt,
      ASOZSystemRequestNumber: formData.ASOZSystemRequestNumber
    });

    await actionService.add({
      ip,
      initiator,
      type: ActionType.USER_CREATE,
      status: ActionStatus.SUCCESS,
      details: {
        createdUserUsername: formData.username,
        createdUserName: formData.name,
        adminName: initiatorName
      }
    });
  } catch (error) {
    await actionService.add({
      ip,
      initiator,
      type: ActionType.USER_CREATE,
      status: ActionStatus.ERROR,
      details: {
        error: getUnknownErrorText(error),
        createdUserUsername: formData.username,
        // createdUserName: formData.name
        // createdUserUsername: formData.username,
        createdUserName: formData.name,
        adminName: initiatorName
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
  types: ActionType[]
) {
  const actionService = new ActionService();
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new ParticipantService()
  );
  const { ip, initiator } = await getMonitoringInitData();

  try {
    const cacheKey = `user_${id}`;
    const cachedUser = cache.get<UserView>(cacheKey) || null;

    if (cachedUser) {
      cache.del(cacheKey);
    }

    const user = await userManager.updateUser(id, formData);

    await Promise.all(
      types.map((type) => {
        return actionService.add({
          ip,
          initiator,
          type,
          status: ActionStatus.SUCCESS,
          details: {
            editedUserUsername: user.username,
            editedUserName: user.name,
            ASOZNumber: formData.ASOZSystemRequestNumber,
            roleAfter:
              type === ActionType.USER_CHANGE_ROLE ? UserRoles[formData.role] : undefined,
            updatedFields: formData
          }
        });
      })
    );
  } catch (error) {
    await Promise.all(
      types.map((type) => {
        actionService.add({
          ip,
          initiator,
          type,
          status: ActionStatus.ERROR,
          details: {
            editedUserId: id,
            error: getUnknownErrorText(error)
          }
        });
      })
    );
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
    const {
      page,
      per_page,
      status,
      role,
      expiresAt,
      search,
      organisation,
      department,
      sort
    } = searchParamsSchema.parse(searchParams);

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
    const expires = (expiresAt?.split('.') as (keyof typeof AccountExpiration)[]) ?? [];
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
        ...(expires.length > 0 && { expires }),
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

export async function isHaveTemporaryPassword(username: string) {
  const userService = new UserService();
  const user = await userService.getBy({ username });

  return user.isTemporaryPassword;
}

export async function IsAccountExpires(username: string) {
  const userService = new UserService();
  const user = await userService.getBy({ username });
  return new Date(user.expiresAt).getTime() < new Date().getTime();
}

export async function blockUserAction({ id, type }: { id: string; type: ActionType }) {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new ParticipantService()
  );

  try {
    await userManager.blockUser({ id, type });
    revalidatePath('/admin/users');
  } catch (error) {
    console.debug(error);
    return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
  }
}

export async function unblockUserAction(id: string) {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new ParticipantService()
  );

  try {
    await userManager.unblockUser(id);
    revalidatePath('/admin/users');
  } catch (error) {
    console.debug(error);
    return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
  }
}

export async function loginAction({
  status,
  details
}: {
  status: ActionStatus;
  details?: MonitoringDetails;
}) {
  const actionService = new ActionService();

  const { ip, initiator, session } = await getMonitoringInitData();

  if (status === ActionStatus.SUCCESS) {
    await actionService.add({
      ip,
      initiator,
      type: ActionType.USER_LOGIN,
      status,
      details: { ...details, name: session?.user.name }
    });
  }

  if (status === ActionStatus.ERROR) {
    await actionService.add({
      ip,
      initiator,
      type: ActionType.USER_LOGIN,
      status,
      details
    });
  }
}

export async function logoutAction() {
  const { ip, initiator, session } = await getMonitoringInitData();
  const actionService = new ActionService();
  actionService.add({
    type: ActionType.USER_LOGOUT,
    ip,
    initiator,
    status: ActionStatus.SUCCESS,
    details: {
      name: session?.user.name
    }
  });
}
