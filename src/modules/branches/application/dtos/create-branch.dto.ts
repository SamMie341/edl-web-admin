import { IsNotEmpty, IsInt, IsString, IsOptional } from "class-validator";

export class CreateBranchDto {
    @IsNotEmpty()
    @IsInt()
    departmentId: number;

    @IsNotEmpty()
    @IsString()
    branchName: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    roleResponsibilities?: string; // ຮັບ HTML ຈາກ Frontend ໄດ້ເລີຍ

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsInt()
    orderIndex?: number;
}