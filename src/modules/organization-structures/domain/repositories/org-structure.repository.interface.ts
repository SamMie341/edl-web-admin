import { OrganizationStructure } from "../../../../generated/prisma/client.js";


export const ORG_STRUCTURE_REPOSITORY = 'ORG_STRUCTURE_REPOSITORY';

export interface IOrgStructureRepository {
    findAll(): Promise<OrganizationStructure[]>;
    findById(id: number): Promise<OrganizationStructure | null>;
    findForDropdown(): Promise<Partial<OrganizationStructure>[]>;
    create(data: any): Promise<OrganizationStructure>;
    update(id: number, data: any): Promise<OrganizationStructure>;
    delete(id: number): Promise<OrganizationStructure>;
}