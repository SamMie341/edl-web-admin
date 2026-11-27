import { HttpException, HttpStatus } from "@nestjs/common";
import * as fs from "fs";
import { extname, resolve, sep } from "path";
import { v4 as uuidv4 } from "uuid";
import "multer";

export const imageFileFilter = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return callback(
            new HttpException('ອະນຸຍາດສະເພາະໄຟລ໌ຮູບພາບເທົ່ານັ້ນ', HttpStatus.BAD_REQUEST),
            false
        );
    }
    callback(null, true);
};

export const editFileName = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
) => {
    const fileExtName = extname(file.originalname);
    const randomName = uuidv4();
    callback(null, `${randomName}${fileExtName}`);
};

export const documentFileFilter = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    if (!file.originalname.match(/\.(pdf)$/i)) {
        return callback(
            new HttpException('ອະນຸຍາດສະເພາະໄຟລ໌ PDF ເທົ່ານັ້ນ', HttpStatus.BAD_REQUEST),
            false,
        );
    }
    callback(null, true);
};

/**
 * Remove a previously uploaded file stored under `../uploads` given its public URL path (e.g. `/uploads/carousels/abc.jpg`).
 */
export const removeUploadedFile = (fileUrl?: string | null): void => {
    if (!fileUrl) return;
    const normalized = fileUrl.replace(/^\/+/, '');
    const uploadsRoot = resolve(process.cwd(), '..', 'uploads');
    const filePath = resolve(process.cwd(), '..', normalized);
    if (!filePath.startsWith(`${uploadsRoot}${sep}`)) return;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
