import {
    Module,
    MiddlewareConsumer,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from './model/Product';
import ProductController from './product.controller';
import ProductService from './product.service';

import UserModule from '../user/user.module';
import { QueryBuilder } from './middlewares/all-product-query-builder';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
        UserModule,
    ],
    providers: [ProductService],
    controllers: [ProductController],
})
export default class ProductModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(QueryBuilder)
            .forRoutes({ path: '/api/products', method: RequestMethod.GET });
    }
}
