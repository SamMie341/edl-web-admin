import { IsArray, IsInt, IsOptional } from "class-validator";

export class AssignPermissionsDto {
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    permissionIds?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    deniedPermissionIds?: number[];
}
