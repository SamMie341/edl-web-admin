import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { UsersController } from "./presentation/users.controller.js";
import { GetUsersUseCase } from "./application/use-cases/get-users.use-case.js";
import { USER_REPOSITORY } from "./domain/repositories/user.repository.interface.js";
import { PrismaUserRepository } from "./infrastructure/database/prisma-user.repository.js";
import { SyncUserUseCase } from "./application/use-cases/sync-user.use-case.js";
import { HRM_SERVICE } from "./domain/repositories/hrm.service.interface.js";
import { HrmService } from "./infrastructure/external/hrm.service.js";
import { UpdateUserUseCase } from "./application/use-cases/update-users.use-case.js";
import { DeleteUserUseCase } from "./application/use-cases/delete-user.use-case.js";

@Module({
    imports: [HttpModule],
    controllers: [UsersController],
    providers: [
        SyncUserUseCase,
        {
            provide: HRM_SERVICE,
            useClass: HrmService,
        },
        GetUsersUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: PrismaUserRepository,
        }
    ]
})
export class UsersModule { }