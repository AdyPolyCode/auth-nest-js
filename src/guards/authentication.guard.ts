import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

import UserService from '../modules/user/user.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private userService: UserService) {}

    canActivate(context: ExecutionContext): Promise<boolean> {
        return this.checkToken(context);
    }

    private async checkToken(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const tokenString = request.headers['x-authorization'];

        if (!tokenString) {
            throw new UnauthorizedException({
                message: `Missing credentials`,
                statusCode: 401,
            });
        }

        const user = await this.userService.findByTokenString(
            tokenString.toString()
        );

        if (!user.isVerified) {
            throw new BadRequestException({
                message: `Please verify your email`,
                statusCode: 400,
            });
        }

        return true;
    }
}
