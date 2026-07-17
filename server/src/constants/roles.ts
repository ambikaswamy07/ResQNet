export const USER_ROLES = [
    "Citizen",
    "Volunteer",
    "Dispatcher",
    "Hospital",
    "Admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const INCIDENT_STATUS = [
    "Reported",
    "Assigned",
    "Accepted",
    "In Progress",
    "Completed",
    "Cancelled",
] as const;

export type IncidentStatus = (typeof INCIDENT_STATUS)[number];