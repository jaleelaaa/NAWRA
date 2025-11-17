/**
 * Permission constants and utilities for role-based access control
 */

// Permission constants matching backend permissions
export const PERMISSIONS = {
  USERS: {
    CREATE: 'users.create',
    READ: 'users.read',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
  },
  INVENTORY: {
    CREATE: 'inventory.create',
    READ: 'inventory.read',
    UPDATE: 'inventory.update',
    DELETE: 'inventory.delete',
  },
  CIRCULATION: {
    CHECKOUT: 'circulation.checkout',
    CHECKIN: 'circulation.checkin',
    RENEW: 'circulation.renew',
  },
  ACQUISITIONS: {
    CREATE: 'acquisitions.create',
    READ: 'acquisitions.read',
    UPDATE: 'acquisitions.update',
    DELETE: 'acquisitions.delete',
  },
  REPORTS: {
    VIEW: 'reports.view',
    GENERATE: 'reports.generate',
  },
  SETTINGS: {
    MANAGE: 'settings.manage',
  },
  CATALOG: {
    SEARCH: 'catalog.search',
  },
  PROFILE: {
    VIEW: 'profile.view',
    UPDATE: 'profile.update',
  },
  FEES: {
    COLLECT: 'fees.collect',
  },
} as const;

// Menu item to required permissions mapping
export const MENU_PERMISSIONS: Record<string, string[]> = {
  dashboard: [], // Everyone can see dashboard (content may differ)
  users: [PERMISSIONS.USERS.READ],
  catalog: [PERMISSIONS.INVENTORY.READ, PERMISSIONS.CATALOG.SEARCH],
  circulation: [
    PERMISSIONS.CIRCULATION.CHECKOUT,
    PERMISSIONS.CIRCULATION.CHECKIN,
    PERMISSIONS.CIRCULATION.RENEW,
  ],
  reports: [PERMISSIONS.REPORTS.VIEW],
  settings: [PERMISSIONS.SETTINGS.MANAGE],
};

// Role names
export const ROLES = {
  ADMINISTRATOR: 'Administrator',
  LIBRARIAN: 'Librarian',
  CIRCULATION_STAFF: 'Circulation Staff',
  CATALOGER: 'Cataloger',
  PATRON: 'Patron',
} as const;

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userPermissions: string[] | undefined,
  requiredPermission: string
): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if user has ALL of the required permissions
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean {
  if (!userPermissions) return false;
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
}

/**
 * Check if user has ANY of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean {
  if (!userPermissions || requiredPermissions.length === 0) return false;
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Check if user can access a menu item
 */
export function canAccessMenuItem(
  userPermissions: string[] | undefined,
  menuId: string
): boolean {
  const requiredPermissions = MENU_PERMISSIONS[menuId];

  // If no permissions required, everyone can access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // User needs at least ONE of the required permissions
  return hasAnyPermission(userPermissions, requiredPermissions);
}

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: string | undefined, requiredRole: string): boolean {
  return userRole === requiredRole;
}

/**
 * Check if user has ANY of the specified roles
 */
export function hasAnyRole(
  userRole: string | undefined,
  requiredRoles: string[]
): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

/**
 * Check if user is staff (not patron)
 */
export function isStaff(userType: string | undefined): boolean {
  return userType === 'staff';
}

/**
 * Check if user is patron
 */
export function isPatron(userType: string | undefined): boolean {
  return userType === 'patron';
}

/**
 * Get visible menu items for user based on permissions
 */
export function getVisibleMenuItems(
  menuItems: Array<{ id: string; [key: string]: any }>,
  userPermissions: string[] | undefined
): Array<{ id: string; [key: string]: any }> {
  return menuItems.filter((item) =>
    canAccessMenuItem(userPermissions, item.id)
  );
}

/**
 * Check if user can perform CRUD operations on a resource
 */
export function canCreate(
  userPermissions: string[] | undefined,
  resource: keyof typeof PERMISSIONS
): boolean {
  const permission = PERMISSIONS[resource]?.CREATE;
  return permission ? hasPermission(userPermissions, permission) : false;
}

export function canRead(
  userPermissions: string[] | undefined,
  resource: keyof typeof PERMISSIONS
): boolean {
  const permission = PERMISSIONS[resource]?.READ;
  return permission ? hasPermission(userPermissions, permission) : false;
}

export function canUpdate(
  userPermissions: string[] | undefined,
  resource: keyof typeof PERMISSIONS
): boolean {
  const permission = PERMISSIONS[resource]?.UPDATE;
  return permission ? hasPermission(userPermissions, permission) : false;
}

export function canDelete(
  userPermissions: string[] | undefined,
  resource: keyof typeof PERMISSIONS
): boolean {
  const permission = PERMISSIONS[resource]?.DELETE;
  return permission ? hasPermission(userPermissions, permission) : false;
}
