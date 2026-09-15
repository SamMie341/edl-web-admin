import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IHrmService } from "../../domain/repositories/hrm.service.interface.js";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HrmService implements IHrmService {
    constructor(private readonly httpService: HttpService) { }

    private async getHrmToken(): Promise<string> {
        const loginUrl = 'https://api-test.edl.com.la/hrm/api/auth/login';
        const credentials = { username: 'Ton', password: 'HRM1234' };

        const response = await firstValueFrom(this.httpService.post(loginUrl, credentials));
        if (!response.data || !response.data.token) {
            throw new UnauthorizedException('ບໍ່ສາມາດຮັບ Token ຈາກ HRM ໄດ້');
        }
        return response.data.token;
    }

    async getEmployeeData(employeeCode: string): Promise<any> {
        const hrmToken = await this.getHrmToken();
        const url = `https://api-test.edl.com.la/hrm/api/hrms/employee?search=${employeeCode}`;

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