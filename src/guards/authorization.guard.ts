import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import UserService from '../modules/user/user.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UserService
    ) {}

    canActivate(context: ExecutionContext): Promise<boolean> {
        return this.checkRoles(context);
    }

    private async checkRoles(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const roles = this.reflector.get('role', context.getHandler());

        const tokenString = request.headers['x-authorization'];

        if (!tokenString) {
            throw new UnauthorizedException({
                message: 'Authentication is needed',
                statusCode: 401,
            });
        }

        const user = await this.userService.findByTokenString(
            tokenString.toString()
        );

        if (!roles.includes(user.role)) {
            throw new ForbiddenException({
                message: 'Not allowed to do this',
                statusCode: 403,
            });
        }

        request.user = user;

        return true;
    }
}
