import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    empCode: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}