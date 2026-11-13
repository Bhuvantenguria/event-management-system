export type UserRole =
  | "super_admin"
  | "event_admin"
  | "finance_admin"
  | "sports_admin"
  | "gallery_admin"
  | "event_coordinator"
  | "scanner_staff"
  | "participant";

export interface PermissionCheck {
  role?: string | null;
  requiredRole?: UserRole | UserRole[];
}

export function hasRole(userRole?: string | null, allowedRoles?: UserRole | UserRole[]): boolean {
  if (!userRole) return false;
  if (userRole === "super_admin") return true; // Super admin has universal access

  if (!allowedRoles) return true;
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole as UserRole);
  }
  return userRole === allowedRoles;
}

export const ROLE_PERMISSIONS = {
  super_admin: ["*"],
  event_admin: ["events:read", "events:write", "categories:manage", "schedules:manage"],
  finance_admin: ["payments:verify", "payments:read", "reports:finance"],
  sports_admin: ["sports:manage", "tournaments:manage", "fixtures:manage", "matches:record"],
  gallery_admin: ["gallery:upload", "gallery:edit", "cultural_collections:manage"],
  event_coordinator: ["registrations:read_assigned", "attendance:view_assigned"],
  scanner_staff: ["tickets:scan", "attendance:record"],
  participant: ["profile:manage", "registrations:own", "tickets:own", "payments:own"],
};
