import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Token, TokenSchema } from './model/Token';
import TokenService from './token.service';

import SharedModule from '../shared/shared.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Token.name,
                schema: TokenSchema,
            },
        ]),
        SharedModule,
    ],
    providers: [TokenService],
    exports: [TokenService],
})
export default class TokenModule {}
