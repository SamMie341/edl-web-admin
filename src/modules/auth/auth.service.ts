import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../core/database/prisma.service.js";
import { LoginDto } from "./dto/login.dto.js";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { employeeCode: loginDto.empCode }
        });

        if (!user) {
            throw new UnauthorizedException('ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('ລະຫັດພະນັກງານ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ');
        }

        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedException('ບັນຊີຂອງທ່ານຖືກລະງັບ');
        }

        const payload = {
            sub: user.id,
            employeeCode: user.employeeCode,
            firstName: user.firstName,
            lastName: user.lastName,
            department: user.departmentName,
            division: user.divisionName,
            unit: user.unitName,
            role: user.role,
        };

        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                employeeCode: user.employeeCode,
                firstName: user.firstName,
                lastName: user.lastName,
                department: user.departmentName,
                division: user.divisionName,
                unit: user.unitName,
                role: user.role,
            }
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }
}