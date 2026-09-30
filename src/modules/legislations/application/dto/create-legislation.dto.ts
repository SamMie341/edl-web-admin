import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LegislationStatus } from '../../../../generated/prisma/enums.js';

export class CreateLegislationDto {
    @IsNotEmpty()
    @IsString()
    documentNumber: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional() // ອະນຸຍາດໃຫ້ວ່າງໄວ້ກ່ອນຕອນສ້າງ ແລ້ວຄ່ອຍອັບໂຫຼດໄຟລ໌ຕາມຫຼັງ
    @IsString()
    fileUrl?: string;

    @IsNotEmpty()
    @IsDateString()
    issueDate: string;

    @IsOptional()
    @IsEnum(LegislationStatus)
    status?: LegislationStatus;
}