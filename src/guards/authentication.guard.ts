import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
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

        const tokenString = request.headers['x-authorization'].toString();

        if (!tokenString) {
            throw new UnauthorizedException({
                message: `Missing credentials`,
                statusCode: 401,
            });
        }

        await this.userService.findByTokenString(tokenString);

        return true;
    }
}
