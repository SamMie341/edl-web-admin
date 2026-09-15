import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateDepartmentDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'ຊື່ຝ່າຍຕ້ອງບໍ່ຫວ່າງເປົ່າ (ชื่อฝ่ายต้องไม่ว่างเปล่า)' })
    name?: string;
}