import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';// Import Enum ຈາກ Prisma
import { CommonStatus, StructureType } from '../../../../generated/prisma/enums.js';

export class CreateOrgStructureDto {
    @IsNotEmpty()
    @IsEnum(StructureType)
    structureType: StructureType;

    @IsNotEmpty()
    @IsString()
    structureName: string;

    @IsOptional() // ຫຼື IsOptional() ຖ້າອະນຸຍາດໃຫ້ບໍ່ມີຮູບຕອນສ້າງ
    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}