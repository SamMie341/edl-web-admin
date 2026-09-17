import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ElectricalKnowledgeStatus } from '../../../../generated/prisma/enums.js';

export class CreateElectricalKnowledgeDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    coverImage?: string;

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsString()
    content?: string; // ສາມາດຮັບເປັນ HTML ຈາກ Rich Text Editor ໄດ້ເລີຍ

    @IsOptional()
    @IsEnum(ElectricalKnowledgeStatus)
    status?: ElectricalKnowledgeStatus;
}