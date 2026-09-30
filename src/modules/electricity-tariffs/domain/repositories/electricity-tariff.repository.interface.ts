import { ElectricityTariff } from "../../../../generated/prisma/client.js";
export const ELECTRICITY_TARIFF_REPOSITORY = 'ELECTRICITY_TARIFF_REPOSITORY';

export interface IElectricityTariffRepository {
    findAll(search?: string, page?: number, limit?: number): Promise<{ data: ElectricityTariff[], meta: any }>;
    findById(id: number): Promise<ElectricityTariff | null>;
    create(data: any): Promise<ElectricityTariff>;
    update(id: number, data: any): Promise<ElectricityTariff>;
    delete(id: number): Promise<ElectricityTariff>;
}