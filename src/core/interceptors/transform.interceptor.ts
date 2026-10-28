import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ApiResponse } from "../interfaces/api-response.interface.js";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> | Promise<Observable<ApiResponse<T>>> {
        return next.handle().pipe(
            map((res: any) => {
                if (res && typeof res === 'object' && 'data' in res && 'meta' in res) {
                    return {
                        statusCode: context.switchToHttp().getResponse().statusCode,
                        message: 'Success',
                        data: res.data,
                        meta: res.meta,
                    };
                }

                return {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: 'Success',
                    data: res,
                };
            })
        );
    }
}
