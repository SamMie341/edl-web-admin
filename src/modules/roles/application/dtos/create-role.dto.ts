import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນຊື່ສິດທິ (Role Name)' })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    permissionIds?: number[];
}
