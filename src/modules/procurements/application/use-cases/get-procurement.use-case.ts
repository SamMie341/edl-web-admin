import { Injectable, Inject } from '@nestjs/common';
import * as procurementRepositoryInterface from '../../domain/repositories/procurement.repository.interface.js';

@Injectable()
export class GetProcurementsUseCase {
    constructor(@Inject(procurementRepositoryInterface.PROCUREMENT_REPOSITORY) private readonly repository: procurementRepositoryInterface.IProcurementRepository) { }
    async execute(search?: string, page: number = 1, limit: number = 10) {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
        return this.repository.findAll(search, validPage, validLimit);
    }
}