import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { AbstractHttpAdapter } from "@nestjs/core";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";

@Catch()
export class GlobaHttpExceptionlFilter implements ExceptionFilter { 
    constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const httpAdapter = this.httpAdapterHost;

        let errorMessage: unknown;
        let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof PrismaClientValidationError) {
            errorMessage = exception.message;
            httpStatus = HttpStatus.CONFLICT;
        }

        if (exception instanceof PrismaClientKnownRequestError) { 
            const code = exception?.code || 'UNKNOWN_PRISMA_ERROR';
            if (code === 'P2002') {
                errorMessage = 'Attribute aleady exist';
                httpStatus = HttpStatus.CONFLICT;
            } else {
                errorMessage = `Error (${code}): ${exception.message}`;
                httpStatus = HttpStatus.BAD_REQUEST;
            }
        }

        if(exception instanceof HttpException) {
            errorMessage = exception.getResponse();
            httpStatus = exception.getStatus()
        }

        const errorResponse = {
            errors: typeof errorMessage === 'string' ? [errorMessage] : errorMessage,
        };
        httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
    }
}