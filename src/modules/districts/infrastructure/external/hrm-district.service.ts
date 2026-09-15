import { BadRequestException, Injectable } from "@nestjs/common";
import { IHrmDistrictService } from "../../domain/repositories/hrm-district.service.interface.js";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HrmDistrictService implements IHrmDistrictService {
    constructor(private readonly httpService: HttpService) { }

    async fetchDistricts(): Promise<any[]> {
        try {
            const url = 'https://hrm.edl.com.la/api_v2/address-svc/district/district';
            const response = await firstValueFrom(this.httpService.get(url));
            if (response.data && response.data.data) {
                return response.data.data;
            }
            throw new Error('ບໍ່ພົບຂໍ້ມູຸນເມືອງໃນ API');
        } catch (error: any) {
            throw new BadRequestException(`ບໍ່ສາມາດດຶງຂໍ້ມູນເມືອງໄດ້: ${error.message}`);
        }
    }
}