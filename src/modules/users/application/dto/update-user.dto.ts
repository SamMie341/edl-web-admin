import { IsOptional, IsString, IsIn, IsEnum } from 'class-validator';
import { Role, UserStatus } from '../../../../generated/prisma/enums.js';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsIn([Role.SUPERADMIN, Role.ADMIN, Role.EDITOR, Role.STAFF], { message: 'ສະຖານະບໍ່ຖືກຕ້ອງ' })
    role?: Role;

    @IsOptional()
    @IsString()
    @IsIn([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED], {
        message: 'ສະຖານະບໍ່ຖືກຕ້ອງ'
    })
    status?: UserStatus;
}