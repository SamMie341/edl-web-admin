import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { CommonStatus } from "../../../../generated/prisma/enums.js";

export class CreateCarouselDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    orderIndex?: number;

    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}
