export type UserRole =
  | "admin"
  | "super_admin"
  | "student"
  | "participant"
  | "event_admin"
  | "finance_admin"
  | "sports_admin"
  | "gallery_admin"
  | "event_coordinator"
  | "scanner_staff";

export interface PermissionCheck {
  role?: string | null;
  requiredRole?: UserRole | UserRole[];
}

export function hasRole(userRole?: string | null, allowedRoles?: UserRole | UserRole[]): boolean {
  if (!userRole) return false;
  // Single Admin (admin or super_admin) has universal administrative access
  if (userRole === "admin" || userRole === "super_admin") return true;

  if (!allowedRoles) return true;
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole as UserRole);
  }
  return userRole === allowedRoles;
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ["*"],
  super_admin: ["*"],
  student: ["profile:manage", "registrations:own", "tickets:own", "payments:own"],
  participant: ["profile:manage", "registrations:own", "tickets:own", "payments:own"],
  event_admin: ["*"],
  finance_admin: ["*"],
  sports_admin: ["*"],
  gallery_admin: ["*"],
  event_coordinator: ["*"],
  scanner_staff: ["*"],
};
