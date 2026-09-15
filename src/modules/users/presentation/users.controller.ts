import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { GetUsersUseCase } from "../application/use-cases/get-users.use-case.js";
import { SyncUserUseCase } from "../application/use-cases/sync-user.use-case.js";
import { UpdateUserUseCase } from "../application/use-cases/update-users.use-case.js";
import { UpdateUserDto } from "../application/dto/update-user.dto.js";
import { DeleteUserUseCase } from "../application/use-cases/delete-user.use-case.js";

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly getUsersUseCase: GetUsersUseCase,
        private readonly syncUsersUseCase: SyncUserUseCase,
        private readonly updateUseCase: UpdateUserUseCase,
        private readonly deleteUseCase: DeleteUserUseCase,
    ) { }

    @Post('sync/:empCode')
    async syncHrmData(@Param('empCode') empCode: string) {
        const syncedUser = await this.syncUsersUseCase.execute(empCode);
        return {
            message: 'Sync ຂໍ້ມູນສຳເລັດ',
            user: syncedUser,
        }
    }

    @Get()
    async findAll() {
        return this.getUsersUseCase.execute();
    }

    @Put('change-role/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return await this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.deleteUseCase.execute(id);
    }
}