import { IsNotEmpty, IsString } from "class-validator";

export class CreateNewsTagDto {
    @IsNotEmpty()
    @IsString()
    tagName: string;
}