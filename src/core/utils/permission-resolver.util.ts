export interface PermissionKeyItem {
    id?: number;
    module: string;
    action: string;
}

export interface UserPermissionOverride<T extends PermissionKeyItem = PermissionKeyItem> {
    effect?: string | null;
    permission: T;
}

export interface ResolvedPermissions<T extends PermissionKeyItem = PermissionKeyItem> {
    effectivePermissions: T[];
    allowedPermissions: T[];
    deniedPermissions: T[];
}

/**
 * Resolves effective user permissions by combining role permissions with
 * per-user ALLOW grants and subtracting per-user DENY revocations.
 */
export function resolveEffectivePermissions<T extends PermissionKeyItem>(
    rolePermissions: T[] = [],
    userPermissions: UserPermissionOverride<T>[] = [],
): ResolvedPermissions<T> {
    const effectiveMap = new Map<string, T>();
    const allowedPermissions: T[] = [];
    const deniedPermissions: T[] = [];

    for (const p of rolePermissions) {
        effectiveMap.set(`${p.module}:${p.action}`, p);
    }

    for (const up of userPermissions) {
        const key = `${up.permission.module}:${up.permission.action}`;
        if (up.effect === 'DENY') {
            deniedPermissions.push(up.permission);
        } else {
            allowedPermissions.push(up.permission);
            effectiveMap.set(key, up.permission);
        }
    }

    // Apply DENY after ALLOW so explicit denials always revoke matching permissions.
    for (const denied of deniedPermissions) {
        effectiveMap.delete(`${denied.module}:${denied.action}`);
    }

    return {
        effectivePermissions: Array.from(effectiveMap.values()),
        allowedPermissions,
        deniedPermissions,
    };
}

export interface ActorPermissionContext {
    role?: string | null;
    permissions?: PermissionKeyItem[];
    deniedPermissions?: PermissionKeyItem[];
}

export function isPermissionDenied(
    deniedPermissions: PermissionKeyItem[] = [],
    target: PermissionKeyItem,
): boolean {
    return deniedPermissions.some(
        (p) => p.module === target.module && p.action === target.action,
    );
}

export function hasUserEffectivePermission(
    user: ActorPermissionContext | undefined | null,
    target: PermissionKeyItem,
): boolean {
    if (!user) {
        return false;
    }

    if (isPermissionDenied(user.deniedPermissions, target)) {
        return false;
    }

    if (user.role === 'SUPERADMIN') {
        return true;
    }

    return (user.permissions ?? []).some(
        (p) => p.module === target.module && p.action === target.action,
    );
}

export function findMissingActorPermissions<T extends PermissionKeyItem>(
    actor: ActorPermissionContext,
    targetPermissions: T[] = [],
): T[] {
    return targetPermissions.filter((perm) => !hasUserEffectivePermission(actor, perm));
}
