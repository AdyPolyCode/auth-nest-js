import {
    Catch,
    HttpException,
    ArgumentsHost,
    ExceptionFilter,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class BaseExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const statusCode = exception.getStatus();

        console.log('base', exception);

        const errorPayload = {
            message: exception.message,
            statusCode: statusCode,
            url: request.url,
        };

        response.status(statusCode).json(errorPayload);
    }
}
