import { BadRequestException, Injectable } from "@nestjs/common";
import { IHrmAddressService } from "../../domain/repositories/hrm-address.service.interface.js";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class HrmAddressService implements IHrmAddressService {
    constructor(private readonly httpService: HttpService) { }
    async fetchProvinces(): Promise<any[]> {
        try {
            const url = 'https://hrm.edl.com.la/api_v2/address-svc/province/provinces';
            const response = await firstValueFrom(this.httpService.get(url));

            if (response.data && response.data.data) {
                return response.data.data;
            }
            throw new Error('ບໍ່ພົບຂໍ້ມູນແຂວງໃນ API');
        } catch (error: any) {
            throw new BadRequestException(`ບໍ່ສາມາດດຶງຂໍ້ມູນແຂວງຈາກ API ໄດ້: ${error.message}`);
        }
    }
}