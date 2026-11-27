import { HttpException, HttpStatus } from "@nestjs/common";
import type { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface.js";
import * as fs from "fs";
import { diskStorage } from "multer";
import { extname, join, resolve, sep } from "path";
import { v4 as uuidv4 } from "uuid";
import "multer";

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_DOCUMENT_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i;
const ALLOWED_IMAGE_MIME_REGEX = /^image\/(jpeg|pjpeg|png|gif|webp)$/i;
const ALLOWED_PDF_EXT_REGEX = /\.(pdf)$/i;
const ALLOWED_PDF_MIME_REGEX = /^application\/(pdf|x-pdf)$/i;

export const imageFileFilter = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    const extValid = ALLOWED_IMAGE_EXT_REGEX.test(file.originalname);
    const mimeValid = ALLOWED_IMAGE_MIME_REGEX.test(file.mimetype);
    if (!extValid || !mimeValid) {
        return callback(
            new HttpException('ອະນຸຍາດສະເພາະໄຟລ໌ຮູບພາບ (JPG, PNG, GIF, WEBP) ເທົ່ານັ້ນ', HttpStatus.BAD_REQUEST),
            false,
        );
    }
    callback(null, true);
};

export const editFileName = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
) => {
    const fileExtName = extname(file.originalname).toLowerCase();
    const randomName = uuidv4();
    callback(null, `${randomName}${fileExtName}`);
};

export const documentFileFilter = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    const extValid = ALLOWED_PDF_EXT_REGEX.test(file.originalname);
    const mimeValid = ALLOWED_PDF_MIME_REGEX.test(file.mimetype);
    if (!extValid || !mimeValid) {
        return callback(
            new HttpException('ອະນຸຍາດສະເພາະໄຟລ໌ PDF ເທົ່ານັ້ນ', HttpStatus.BAD_REQUEST),
            false,
        );
    }
    callback(null, true);
};

function createUploadMulterOptions(
    subDirs: string[],
    fileFilter: MulterOptions['fileFilter'],
    fileSize: number,
): MulterOptions {
    return {
        storage: diskStorage({
            destination: (req, file, callback) => {
                const dest = join(process.cwd(), '..', 'uploads', ...subDirs);
                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest, { recursive: true });
                }
                callback(null, dest);
            },
            filename: editFileName,
        }),
        fileFilter,
        limits: { fileSize },
    };
}

export const createImageUploadOptions = (
    subDirs: string[],
    maxSizeBytes = MAX_IMAGE_FILE_SIZE,
): MulterOptions => createUploadMulterOptions(subDirs, imageFileFilter, maxSizeBytes);

export const createDocumentUploadOptions = (
    subDirs: string[],
    maxSizeBytes = MAX_DOCUMENT_FILE_SIZE,
): MulterOptions => createUploadMulterOptions(subDirs, documentFileFilter, maxSizeBytes);

/**
 * Verifies the leading magic bytes of an uploaded file match its extension.
 */
export const hasValidFileSignature = (filePath: string, originalName: string): boolean => {
    if (!fs.existsSync(filePath)) return false;

    const fd = fs.openSync(filePath, 'r');
    try {
        const buffer = Buffer.alloc(32);
        const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
        if (bytesRead < 4) return false;

        const ext = extname(originalName).toLowerCase();

        if (ext === '.jpg' || ext === '.jpeg') {
            return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        }
        if (ext === '.png') {
            return bytesRead >= 8
                && buffer[0] === 0x89
                && buffer[1] === 0x50
                && buffer[2] === 0x4e
                && buffer[3] === 0x47
                && buffer[4] === 0x0d
                && buffer[5] === 0x0a
                && buffer[6] === 0x1a
                && buffer[7] === 0x0a;
        }
        if (ext === '.gif') {
            if (bytesRead < 6) return false;
            const header = buffer.subarray(0, 6).toString('ascii');
            return header === 'GIF87a' || header === 'GIF89a';
        }
        if (ext === '.webp') {
            return bytesRead >= 12
                && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
                && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
        }
        if (ext === '.pdf') {
            const head = buffer.subarray(0, bytesRead).toString('latin1');
            return head.includes('%PDF-');
        }

        return false;
    } finally {
        fs.closeSync(fd);
    }
};

export const collectUploadedFiles = (req: {
    file?: Express.Multer.File;
    files?: Express.Multer.File[] | Record<string, Express.Multer.File[]>;
}): Express.Multer.File[] => {
    const collected: Express.Multer.File[] = [];
    if (req.file) {
        collected.push(req.file);
    }
    if (Array.isArray(req.files)) {
        collected.push(...req.files);
    } else if (req.files && typeof req.files === 'object') {
        for (const group of Object.values(req.files)) {
            if (Array.isArray(group)) {
                collected.push(...group);
            }
        }
    }
    return collected;
};

export const unlinkUploadedFiles = (files: Express.Multer.File[]): void => {
    for (const file of files) {
        if (file?.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    }
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
