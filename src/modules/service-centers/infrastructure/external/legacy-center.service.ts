import { BadRequestException, Injectable } from "@nestjs/common";
import { ILegacyCenterService } from "../../domain/repositories/legacy-center.service.interface.js";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import path from "node:path";
import * as fs from "fs";
import { promisify } from "util";
import * as stream from 'stream';

const finished = promisify(stream.finished);

@Injectable()
export class LegacyCenterService implements ILegacyCenterService {
    constructor(private readonly httpService: HttpService) { }

    async fetchCentersByProvince(provinceId: number): Promise<any[]> {
        try {
            const url = `https://edl-inside-api.edl.com.la/api_v1/admin-svc/center/getByProvince?province_id=${provinceId}`;
            const response = await firstValueFrom(this.httpService.get(url));
            if (response.data && response.data.statusCode === 200) {
                return response.data.data;
            }
            return [];
        } catch (error: any) {
            throw new BadRequestException(`ບໍ່ສາມາດດຶງຂໍ້ມູນສູນບໍລິການຈາກແຂວງ ${provinceId} ໄດ້: ${error.message}`);
        }
    }

    async downloadImage(url: string, fileName: string): Promise<string | null> {
        try {
            const uploadDir = path.join(process.cwd(), '..', 'uploads', 'centers');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = path.join(uploadDir, fileName);
            if (fs.existsSync(filePath)) {
                return `uploads/centers/${fileName}`;

            }
            const response = await this.httpService.axiosRef({
                url,
                method: 'GET',
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
                }
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            await finished(writer);

            return `/uploads/centers/${fileName}`;
        } catch (error) {
            console.warn(`[Warning] ໂຫຼດຮູບສູນ ${fileName} ບໍ່ສຳເລັດ`);
            return null;
        }
    }
}