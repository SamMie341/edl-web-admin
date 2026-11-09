import { Injectable } from '@nestjs/common';
import { IOrgStructureRepository } from '../../domain/repositories/org-structure.repository.interface.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { OrganizationStructure } from '../../../../generated/prisma/client.js';

@Injectable()
export class PrismaOrgStructureRepository implements IOrgStructureRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findForDropdown(): Promise<Partial<OrganizationStructure>[]> {
        return this.prisma.organizationStructure.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                structureName: true,
                structureType: true,
            },
            orderBy: { orderIndex: 'asc' }
        });
    }

    async findAll(): Promise<OrganizationStructure[]> {
        return this.prisma.organizationStructure.findMany({
            orderBy: { orderIndex: 'asc' },
        });
    }

    async findById(id: number): Promise<OrganizationStructure | null> {
        return this.prisma.organizationStructure.findUnique({
            where: { id },
        });
    }

    async create(data: any): Promise<OrganizationStructure> {
        return this.prisma.organizationStructure.create({
            data: {
                ...data,
                imageUrl: data.imageUrl ?? '',
            },
        });
    }

    async update(id: number, data: any): Promise<OrganizationStructure> {
        const updateData = { ...data };
        if (updateData.imageUrl === null) {
            updateData.imageUrl = '';
        }
        return this.prisma.organizationStructure.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id: number): Promise<OrganizationStructure> {
        return this.prisma.organizationStructure.delete({
            where: { id },
        });
    }
}
