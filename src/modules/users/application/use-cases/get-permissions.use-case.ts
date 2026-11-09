import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../core/database/prisma.service.js";

@Injectable()
export class GetPermissionsUseCase {
    constructor(private readonly prisma: PrismaService) { }

    async execute() {
        return await this.prisma.permission.findMany({
            orderBy: [
                { module: 'asc' },
                { action: 'asc' },
            ],
        });
    }
}
