import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { Error } from 'mongoose';
import { MongoError } from 'mongoose/node_modules/mongodb';

import { Request, Response } from 'express';

@Catch(Error, MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        const errorPayload = {
            message: null,
            explanation: null,
            statusCode: null,
            url: null,
        };

        switch (exception.name) {
            case 'CastError':
                errorPayload.message = exception.message;
                errorPayload.explanation =
                    'Caused by and invalid item identifier';
                errorPayload.statusCode = 400;
                errorPayload.url = request.url;
                break;
            // E11000
            case 'MongoServerError':
                errorPayload.message = exception.message;
                errorPayload.explanation =
                    'One of the specified values already exist';
                errorPayload.statusCode = 400;
                errorPayload.url = request.url;
                break;
            // Validation
            case 'ValidationError':
                errorPayload.message = exception.message;
                errorPayload.explanation =
                    'One of the specified values is missing';
                errorPayload.statusCode = 422;
                errorPayload.url = request.url;
                break;
        }

        response
            .status(errorPayload.statusCode || 500)
            .json(errorPayload || 'Server error');
    }
}
