import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນຊື່ຝ່າຍ' })
    name: string;
}