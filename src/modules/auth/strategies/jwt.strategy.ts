import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../../core/database/prisma.service.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'super-secret-key-edl-app-admin-123a456z789ya1z2c3f6f2r6e4wc8f8t5e5e2s2d45f7'
        })
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub }
        });

        if (!user || user.status !== 'ACTIVE') {
            throw new UnauthorizedException('ຜູ້ໃຊ້ບໍ່ມີສິດເຂົ້າເຖິງ ຫຼື ບັນຊີຖືກລະງັບ');
        }

        return {
            id: user.id,
            employeeCode: user.employeeCode,
            firstName: user.firstName,
            lastName: user.lastName,
            departmentName: user.departmentName,
            divisionName: user.divisionName,
            unitName: user.unitName,
            role: user.role,
        }
    }
}