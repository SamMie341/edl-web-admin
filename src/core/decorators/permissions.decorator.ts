import { SetMetadata } from "@nestjs/common";

export interface RequiredPermission {
    module: string;
    action: string;
}

export const PERMISSION_KEY = 'required_permission';

export const RequirePermission = (module: string, action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | string) => SetMetadata(PERMISSION_KEY, { module, action });