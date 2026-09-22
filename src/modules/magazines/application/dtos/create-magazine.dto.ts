import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommonStatus } from '../../../../generated/prisma/enums.js';

export class CreateMagazineDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    issueNumber?: string;

    @IsOptional()
    @IsString()
    coverImage?: string;

    @IsOptional() // ອະນຸຍາດໃຫ້ຫວ່າງຕອນສ້າງ ແລ້ວຄ່ອຍອັບໂຫຼດໄຟລ໌ຕາມຫຼັງໄດ້
    @IsString()
    fileUrl?: string;

    @IsOptional()
    @IsDateString()
    publishedDate?: string;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}