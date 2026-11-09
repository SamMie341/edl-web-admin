import { IsOptional, IsString, IsIn, IsInt } from 'class-validator';
import { UserStatus } from '../../../../generated/prisma/enums.js';

export class UpdateUserDto {
    @IsOptional()
    @IsInt()
    roleId?: number;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    @IsIn([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED], {
        message: 'ສະຖານະບໍ່ຖືກຕ້ອງ'
    })
    status?: UserStatus;
}
