import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { OrganizationStructureController } from "./presentation/organization-structure.controller.js";
import { CreateOrgStructureUseCase } from "./application/use-cases/create-org-structure.use-case.js";
import { UpdateOrgStructureUseCase } from "./application/use-cases/update-org-structure.use-case.js";
import { DeleteOrgStructureUseCase } from "./application/use-cases/delete-org-strcuture.use-case.js";
import { GetOrgStructureUseCase } from "./application/use-cases/get-org-structure.use-case.js";
import { ORG_STRUCTURE_REPOSITORY } from "./domain/repositories/org-structure.repository.interface.js";
import { PrismaOrgStructureRepository } from "./infrastructure/database/prisma-org-structure.repository.js";
import { GetOrgStructureDropdownUseCase } from "./application/use-cases/get-org-structures-dropdown.use-case.js";
import { UploadImageStructureUseCase } from "./application/use-cases/upload-org-structure-image.use-case.js";

@Module({
    imports: [PrismaModule],
    controllers: [OrganizationStructureController],
    providers: [
        CreateOrgStructureUseCase,
        UpdateOrgStructureUseCase,
        DeleteOrgStructureUseCase,
        GetOrgStructureUseCase,
        GetOrgStructureDropdownUseCase,
        UploadImageStructureUseCase,
        {
            provide: ORG_STRUCTURE_REPOSITORY,
            useClass: PrismaOrgStructureRepository,
        }
    ]
})
export class OrganizationsModule { }