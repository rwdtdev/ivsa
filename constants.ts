export const UserRoles = {
    // @TODO: для маппинга ролей.
    admin: {
        ru: 'Администратор',
        en: 'Administrator'
    },
    user: {
        ru: 'Пользователь',
        en: 'User'
    }
} as const;

export const UserStatus = {
    active: 'active',
    blocked: 'blocked'
};