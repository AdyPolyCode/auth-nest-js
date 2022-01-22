import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './model/User';

import UserService from './user.service';
import TokenModule from '../token/token.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        TokenModule,
    ],
    providers: [UserService],
    exports: [UserService],
})
export default class UserModule {}
