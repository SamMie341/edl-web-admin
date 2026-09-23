import { IsOptional, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsOptional()
    @IsString()
    oldPassword?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ' })
    newPassword?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ' })
    password?: string;

    @IsOptional()
    @IsString()
    confirmPassword?: string;
}
