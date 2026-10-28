import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../core/database/prisma.service.js";
import { User } from "../../../../generated/prisma/client.js";
import { AuthUser } from "../../domain/entities/auth-user.entity.js";
import { IAuthUserRepository } from "../../domain/repositories/auth-user.repository.interface.js";

@Injectable()
export class PrismaAuthUserRepository implements IAuthUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmployeeCode(employeeCode: string): Promise<AuthUser | null> {
        const user = await this.prisma.user.findUnique({ where: { employeeCode } });
        return user ? this.toDomain(user) : null;
    }

    async findById(id: number): Promise<AuthUser | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? this.toDomain(user) : null;
    }

    async updateLastLogin(id: number, date: Date): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { lastLoginAt: date },
        });
    }

    private toDomain(user: User): AuthUser {
        return new AuthUser({
            id: user.id,
            employeeCode: user.employeeCode,
            firstName: user.firstName,
            lastName: user.lastName,
            passwordHash: user.passwordHash,
            departmentName: user.departmentName,
            divisionName: user.divisionName,
            unitName: user.unitName,
            role: user.role,
            status: user.status,
        });
    }
}
