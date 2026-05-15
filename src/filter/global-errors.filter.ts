import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { AbstractHttpAdapter } from "@nestjs/core";
import { JsonWebTokenError } from "@nestjs/jwt";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";

@Catch()
export class GlobaHttpExceptionsFilter implements ExceptionFilter { 
    constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const httpAdapter = this.httpAdapterHost;

        let errorMessage: string | string[] = 'An unexpected error occurred';
        let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof PrismaClientValidationError) {
            errorMessage = 'Data validation -> Some attributes are missing in the request';
            httpStatus = HttpStatus.CONFLICT;
        }

        if (exception instanceof PrismaClientKnownRequestError) {
            const code = exception.code ?? 'UNKNOWN_ERROR';
            if (code === 'P2002') {
                errorMessage = 'Data validation -> Attribute aleady exist';
                httpStatus = HttpStatus.CONFLICT;
            } else if (code === 'P1001') {
                errorMessage = 'Internal error -> Database not recheable';
                httpStatus = HttpStatus.SERVICE_UNAVAILABLE;
            } else {
                errorMessage = `Error (${code})`;
                httpStatus = HttpStatus.BAD_REQUEST;
            }
        }

        if(exception instanceof JsonWebTokenError) {
            errorMessage = 'Invalid or expired token';
            httpStatus = HttpStatus.UNAUTHORIZED;
        }

        if(exception instanceof HttpException) {
            const res = exception.getResponse();
            errorMessage = typeof res === 'string' ? res : (res as any)?.message ?? res;
            httpStatus = exception.getStatus();
        }

        const errorResponse = {
            errors: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        };
        
        httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
    }
}