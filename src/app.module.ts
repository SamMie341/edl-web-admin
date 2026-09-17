import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { DepartmentsModule } from './modules/departments/departments.module.js';
import { BranchesModule } from './modules/branches/branches.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProvincesModule } from './modules/provinces/provinces.module.js';
import { DistrictsModule } from './modules/districts/districts.module.js';
import { VillagesModule } from './modules/villages/villages.module.js';
import { ServiceCentersModule } from './modules/service-centers/service-center.module.js';
import { OrganizationsModule } from './modules/organization-structures/organization-structures.module.js';
import { VisionMissionModule } from './modules/vision-missions/vision-missions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    BranchesModule,
    ProvincesModule,
    DistrictsModule,
    VillagesModule,
    ServiceCentersModule,
    OrganizationsModule,
    VisionMissionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
