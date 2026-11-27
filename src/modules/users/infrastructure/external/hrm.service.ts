import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IHrmService } from "../../domain/repositories/hrm.service.interface.js";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HrmService implements IHrmService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    private getBaseUrl(): string {
        return this.configService.getOrThrow<string>('HRM_API_BASE_URL').replace(/\/+$/, '');
    }

    private async getHrmToken(): Promise<string> {
        const loginUrl = `${this.getBaseUrl()}/auth/login`;
        const credentials = {
            username: this.configService.getOrThrow<string>('HRM_USERNAME'),
            password: this.configService.getOrThrow<string>('HRM_PASSWORD'),
        };

        const response = await firstValueFrom(this.httpService.post(loginUrl, credentials));
        if (!response.data || !response.data.token) {
            throw new UnauthorizedException('ບໍ່ສາມາດຮັບ Token ຈາກ HRM ໄດ້');
        }
        return response.data.token;
    }

    async getEmployeeData(employeeCode: string): Promise<any> {
        const hrmToken = await this.getHrmToken();
        const url = `${this.getBaseUrl()}/hrms/employee?search=${encodeURIComponent(employeeCode)}`;

        const response = await firstValueFrom(
            this.httpService.get(url, { headers: { Authorization: `Bearer ${hrmToken}` } })
        );

        const responseData = response.data;
        if (!responseData || responseData.data.total_record === 0 || responseData.data.employees.length === 0) {
            throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນພະນັກງານລະຫັດ ${employeeCode} ໃນລະບົບ HRM`);
        }

        return responseData.data.employees[0];
    }
}