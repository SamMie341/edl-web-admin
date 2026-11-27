import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { collectUploadedFiles, unlinkUploadedFiles } from '../utils/file-upload.utils.js';

/**
 * Removes newly uploaded Multer files from disk if downstream pipes or handlers throw an error.
 */
@Injectable()
export class CleanupUploadedFileOnErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            catchError((err: unknown) => {
                const req = context.switchToHttp().getRequest<{
                    file?: Express.Multer.File;
                    files?: Express.Multer.File[] | Record<string, Express.Multer.File[]>;
                }>();
                unlinkUploadedFiles(collectUploadedFiles(req));
                return throwError(() => err);
            }),
        );
    }
}
