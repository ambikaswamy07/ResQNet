export const USER_ROLES = [
    "Citizen",
    "Volunteer",
    "Dispatcher",
    "Hospital",
    "Admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];