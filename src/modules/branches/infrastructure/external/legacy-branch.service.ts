import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ILegacyBranchService } from '../../domain/repositories/legacy-branch.service.interface.js';
import * as path from 'path';
import * as fs from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';

const finished = promisify(stream.finished);

@Injectable()
export class LegacyBranchService implements ILegacyBranchService {
    constructor(private readonly httpService: HttpService) { }

    async downlaodImage(url: string, fileName: string): Promise<string | null> {
        try {
            const uploadDir = path.join(process.cwd(), '..', 'uploads', 'branches');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = path.join(uploadDir, fileName);
            if (fs.existsSync(filePath)) {
                return `/uploads/branches/${fileName}`;
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

            return `/uploads/branches/${fileName}`;
        } catch (error: any) {
            console.error(`Loading Image ${fileName} ບໍ່ສຳເລັດ:`, error.message);
            return null;
        }
    }

    async fetchBranches(): Promise<any[]> {
        try {
            const url = 'https://edl-inside-api.edl.com.la/api_v1/admin-svc/branches/get';
            const response = await firstValueFrom(this.httpService.get(url));

            if (response.data && response.data.statusCode === 200) {
                return response.data.data;
            }
            throw new Error('ຮູບແບບຂໍ້ມູນຕອບກັບບໍ່ຖືກຕ້ອງ');
        } catch (error: any) {
            throw new BadRequestException(`ບໍ່ສາມາດດຶງຂໍ້ມູນສາຂາຈາກລະບົບເດີມໄດ້: ${error.message}`);
        }
    }
}