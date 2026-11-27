import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as fs from 'fs';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Removes a newly uploaded Multer file from disk if downstream pipes or handlers throw an error.
 */
@Injectable()
export class CleanupUploadedFileOnErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            catchError((err: unknown) => {
                const req = context.switchToHttp().getRequest<{ file?: Express.Multer.File }>();
                if (req.file?.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return throwError(() => err);
            }),
        );
    }
}
