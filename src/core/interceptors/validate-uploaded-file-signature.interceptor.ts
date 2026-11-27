import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
    collectUploadedFiles,
    hasValidFileSignature,
    unlinkUploadedFiles,
} from '../utils/file-upload.utils.js';

/**
 * Validates that every file written by Multer has magic bytes matching its extension;
 * deletes invalid uploads immediately before throwing BadRequestException.
 */
@Injectable()
export class ValidateUploadedFileSignatureInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const req = context.switchToHttp().getRequest<{
            file?: Express.Multer.File;
            files?: Express.Multer.File[] | Record<string, Express.Multer.File[]>;
        }>();

        const files = collectUploadedFiles(req);
        if (files.length > 0) {
            const hasInvalid = files.some((file) => !hasValidFileSignature(file.path, file.originalname));
            if (hasInvalid) {
                unlinkUploadedFiles(files);
                throw new BadRequestException('ເນື້ອຫາໄຟລ໌ບໍ່ກົງກັບປະເພດໄຟລ໌ທີ່ອະນຸຍາດ');
            }
        }

        return next.handle();
    }
}
