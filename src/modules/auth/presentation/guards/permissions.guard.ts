import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PERMISSION_KEY, RequiredPermission } from "../../../../core/decorators/permissions.decorator.js";
import { IS_PUBLIC_KEY } from "../../../../core/decorators/public.decorator.js";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // 1. ຖ້າເປັນ Public Route ບໍ່ຕ້ອງເຊັກ Permission
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const required = this.reflector.getAllAndOverride<RequiredPermission>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!required) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານ');
        }

        if (user.role === 'SUPERADMIN') {
            return true;
        }

        const userPermissions: { module: string; action: string }[] = user.permissions || [];

        const hasPermission = userPermissions.some((p) => p.module === required.module && p.action === required.action);

        if (!hasPermission) {
            throw new ForbiddenException('ທ່ານບໍ່ມີສິດເຂົ້າເຖິງ ຫຼື ດຳເນີນການໃນສ່ວນນີ້');
        }

        return true;
    }
}
