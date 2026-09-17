import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

        // Friendly handling for Prisma Known Request Errors
        if (exception?.code === 'P2003') {
            status = HttpStatus.BAD_REQUEST;
            const field = exception.meta?.field_name || exception.meta?.target || 'foreign key';
            message = `Foreign key constraint failed: ຂໍ້ມູນອ້າງອີງ (${field}) ບໍ່ຖືກຕ້ອງ ຫຼື ບໍ່ມີໃນລະບົບ`;
        } else if (exception?.code === 'P2002') {
            status = HttpStatus.CONFLICT;
            const target = exception.meta?.target || 'field';
            message = `Unique constraint failed: ຂໍ້ມູນຊ້ຳຊ້ອນ (${target})`;
        } else if (exception?.code === 'P2025') {
            status = HttpStatus.NOT_FOUND;
            message = exception.meta?.cause || 'ບໍ່ພົບຂໍ້ມູນທີ່ຕ້ອງການໃນລະບົບ';
        }

        if (!(exception instanceof HttpException) && !['P2002', 'P2003', 'P2025'].includes(exception?.code)) {
            console.error('[HttpExceptionFilter] Unhandled Error:', exception);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'string' ? message : (message as any).message || message,
        })
    }
}