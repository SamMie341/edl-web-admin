import { BadRequestException, Injectable } from "@nestjs/common";
import { IHrmVillageService } from "../../domain/repositories/hrm-village.service.interface.js";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HrmVillageService implements IHrmVillageService {
    constructor(private readonly httpService: HttpService) { }

    async fetchVillage(): Promise<any[]> {
        try {
            const url = 'https://hrm.edl.com.la/api_v2/address-svc/village/village';
            const response = await firstValueFrom(this.httpService.get(url));
            if (response.data && response.data.data) {
                return response.data.data;
            }
            throw new Error('ບໍ່ພົບຂໍ້ມູນບ້ານໃນ API');
        } catch (error: any) {
            throw new BadRequestException(`ບໍ່ສາມາດດຶງຂໍ້ມູນບ້ານ ${error.message}`);
        }
    }
}