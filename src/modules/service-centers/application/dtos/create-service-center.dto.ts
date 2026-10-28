import { IsInt, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ServiceCenterStatus } from '../../../../generated/prisma/enums.js';

export class CreateServiceCenterDto {
    @IsNotEmpty()
    @IsString()
    centerName: string;

    @IsOptional()
    @IsInt()
    departmentId?: number;

    @IsOptional()
    @IsInt()
    branchId?: number;

    @IsNotEmpty()
    @IsInt()
    provinceId: number;

    @IsNotEmpty()
    @IsInt()
    districtId: number;

    @IsNotEmpty()
    @IsInt()
    villageId: number;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    longitude?: string | number;

    @IsOptional()
    latitude?: string | number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    status?: ServiceCenterStatus; // ACTIVE, INACTIVE
}