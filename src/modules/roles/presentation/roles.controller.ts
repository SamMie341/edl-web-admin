import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/presentation/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../../auth/presentation/guards/permissions.guard.js";
import { RequirePermission } from "../../../core/decorators/permissions.decorator.js";
import { CreateRoleDto } from "../application/dtos/create-role.dto.js";
import { UpdateRoleDto } from "../application/dtos/update-role.dto.js";
import { CreateRoleUseCase } from "../application/use-cases/create-role.use-case.js";
import { GetRolesUseCase } from "../application/use-cases/get-roles.use-case.js";
import { GetRoleByIdUseCase } from "../application/use-cases/get-role-by-id.use-case.js";
import { UpdateRoleUseCase } from "../application/use-cases/update-role.use-case.js";
import { DeleteRoleUseCase } from "../application/use-cases/delete-role.use-case.js";
import { GetRolesDropdownUseCase } from "../application/use-cases/get-roles-dropdown.use-case.js";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
    constructor(
        private readonly createUseCase: CreateRoleUseCase,
        private readonly getRolesUseCase: GetRolesUseCase,
        private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
        private readonly updateUseCase: UpdateRoleUseCase,
        private readonly deleteUseCase: DeleteRoleUseCase,
        private readonly getRolesDropdownUseCase: GetRolesDropdownUseCase,
    ) { }

    @Post()
    @RequirePermission('ROLES', 'CREATE')
    create(@Body() dto: CreateRoleDto) {
        return this.createUseCase.execute(dto);
    }

    @Get()
    @RequirePermission('ROLES', 'READ')
    findAll(
        @Query('search') search?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.getRolesUseCase.execute(search, pageNum, limitNum);
    }

    @Get('dropdown')
    @RequirePermission('ROLES', 'READ')
    dropdown() {
        return this.getRolesDropdownUseCase.execute();
    }

    @Get(':id')
    @RequirePermission('ROLES', 'READ')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getRoleByIdUseCase.execute(id);
    }

    @Put(':id')
    @RequirePermission('ROLES', 'UPDATE')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @RequirePermission('ROLES', 'DELETE')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }
}
