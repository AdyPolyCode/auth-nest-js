import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import ProductModule from './product/product.module';
import AuthModule from './auth/auth.module';
import SharedModule from './shared/shared.module';

import ConfigService from './shared/config.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [SharedModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return configService.mongoConfig;
            },
        }),
        ProductModule,
        AuthModule,
        SharedModule,
    ],
})
export default class MainModule {}
