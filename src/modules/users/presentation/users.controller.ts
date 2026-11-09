import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/presentation/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../../auth/presentation/guards/permissions.guard.js";
import { RequirePermission } from "../../../core/decorators/permissions.decorator.js";
import { CurrentUser } from "../../../core/decorators/current-user.decorator.js";
import type { RequestUser } from "../../auth/domain/entities/auth-user.entity.js";
import { GetUsersUseCase } from "../application/use-cases/get-users.use-case.js";
import { SyncUserUseCase } from "../application/use-cases/sync-user.use-case.js";
import { UpdateUserUseCase } from "../application/use-cases/update-users.use-case.js";
import { UpdateUserDto } from "../application/dto/update-user.dto.js";
import { DeleteUserUseCase } from "../application/use-cases/delete-user.use-case.js";
import { ChangePasswordUseCase } from "../application/use-cases/change-password.use-case.js";
import { ChangePasswordDto } from "../application/dto/change-password.dto.js";
import { AssignPermissionsUseCase } from "../application/use-cases/assign-permissions.use-case.js";
import { GetPermissionsUseCase } from "../application/use-cases/get-permissions.use-case.js";
import { AssignPermissionsDto } from "../application/dto/assign-permissions.dto.js";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly getUsersUseCase: GetUsersUseCase,
        private readonly syncUsersUseCase: SyncUserUseCase,
        private readonly updateUseCase: UpdateUserUseCase,
        private readonly deleteUseCase: DeleteUserUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,
        private readonly assignPermissionsUseCase: AssignPermissionsUseCase,
        private readonly getPermissionsUseCase: GetPermissionsUseCase,
    ) { }

    @Get('permissions/list')
    async getPermissions() {
        return await this.getPermissionsUseCase.execute();
    }

    @Post('sync/:empCode')
    @RequirePermission('USERS', 'CREATE')
    async syncHrmData(@Param('empCode') empCode: string) {
        const syncedUser = await this.syncUsersUseCase.execute(empCode);
        return {
            message: 'Sync ຂໍ້ມູນສຳເລັດ',
            user: syncedUser,
        };
    }

    @Get()
    @RequirePermission('USERS', 'READ')
    async findAll() {
        return this.getUsersUseCase.execute();
    }

    @Put('change-role/:id')
    @RequirePermission('USERS', 'UPDATE')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return await this.updateUseCase.execute(id, dto);
    }

    @Put(':id/permissions')
    @RequirePermission('USERS', 'UPDATE')
    async assignPermissions(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssignPermissionsDto,
    ) {
        return await this.assignPermissionsUseCase.execute(id, dto);
    }

    @Put('change-password/:id')
    async changePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ChangePasswordDto,
        @CurrentUser() currentUser: RequestUser,
    ) {
        return await this.changePasswordUseCase.execute(id, dto, currentUser);
    }

    @Delete(':id')
    @RequirePermission('USERS', 'DELETE')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.deleteUseCase.execute(id);
    }
}
