import { Magazine } from "../../../../generated/prisma/client.js";


export const MAGAZINE_REPOSITORY = 'MAGAZINE_REPOSITORY';

export interface IMagazineRepository {
    findAll(): Promise<Magazine[]>;
    findById(id: number): Promise<Magazine | null>;
    create(data: any): Promise<Magazine>;
    update(id: number, data: any): Promise<Magazine>;
    delete(id: number): Promise<Magazine>;
    incrementDownloadCount(id: number): Promise<Magazine>; // ສຳລັບນັບຍອດໂຫຼດ
}