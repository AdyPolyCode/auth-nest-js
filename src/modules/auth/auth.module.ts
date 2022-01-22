import { Module } from '@nestjs/common';

import SharedModule from '../shared/shared.module';
import TokenModule from '../token/token.module';
import UserModule from '../user/user.module';

import AuthService from './auth.service';
import AuthController from './auth.controller';

@Module({
    imports: [TokenModule, UserModule, SharedModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export default class AuthModule {}
