import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Populates `request.user` when a valid Bearer JWT is provided, while allowing unauthenticated requests through.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    override handleRequest<TUser = any>(err: unknown, user: TUser | false): TUser | null {
        if (err || !user) {
            return null;
        }
        return user;
    }
}
