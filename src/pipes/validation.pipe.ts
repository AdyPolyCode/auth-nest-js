import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    UnprocessableEntityException,
} from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export default class CustomValidationPipe implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        const object = plainToClass(metatype, value);

        const error = await validate(object);

        if (error.length >= 1) {
            throw new UnprocessableEntityException({
                message: `${error[0].property} should not be ${error[0].value}`,
                statusCode: 422,
            });
        }

        return value;
    }
}
