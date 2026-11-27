import { SetMetadata } from "@nestjs/common";

export const ALLOW_DURING_PASSWORD_CHANGE_KEY = 'allow_during_password_change';

/**
 * Allows authenticated users with `mustChangePassword = true` to access this endpoint
 * (for example, the self-service password change endpoint).
 */
export const AllowDuringPasswordChange = () => SetMetadata(ALLOW_DURING_PASSWORD_CHANGE_KEY, true);
