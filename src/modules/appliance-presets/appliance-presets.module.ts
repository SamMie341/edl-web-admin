import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { CreateAppliancePresetUseCase } from './application/use-cases/create-appliance-preset.use-case.js';
import { DeleteAppliancePresetUseCase } from './application/use-cases/delete-appliance-preset.use-case.js';
import { GetAppliancePresetsUseCase } from './application/use-cases/get-appliance-presets.use-case.js';
import { GetAppliancePresetByIdUseCase } from './application/use-cases/get-appliance-preset-by-id.use-case.js';
import { UpdateAppliancePresetUseCase } from './application/use-cases/update-appliance-preset.use-case.js';
import { APPLIANCE_PRESET_REPOSITORY } from './domain/repositories/appliance-preset.repository.interface.js';
import { PrismaAppliancePresetRepository } from './infrastructure/database/prisma-appliance-preset.repository.js';
import { AppliancePresetsController } from './presentation/appliance-presets.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [AppliancePresetsController],
    providers: [
        GetAppliancePresetsUseCase,
        GetAppliancePresetByIdUseCase,
        CreateAppliancePresetUseCase,
        UpdateAppliancePresetUseCase,
        DeleteAppliancePresetUseCase,
        {
            provide: APPLIANCE_PRESET_REPOSITORY,
            useClass: PrismaAppliancePresetRepository,
        },
    ],
    exports: [
        APPLIANCE_PRESET_REPOSITORY,
        GetAppliancePresetsUseCase,
        GetAppliancePresetByIdUseCase,
    ],
})
export class AppliancePresetsModule { }
