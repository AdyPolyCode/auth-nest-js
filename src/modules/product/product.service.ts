import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './model/Product';
import { ProductCreateReqDto, ProductUpdateReqDto } from './dtos';

@Injectable()
export default class ProductService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<Product>
    ) {}

    async findOne(id: string): Promise<Product> {
        const product = await this.productModel.findOne({
            _id: id,
        });

        if (!product) {
            throw new NotFoundException({
                message: `Product with id: ${id} was not found`,
                statuscode: HttpStatus.NOT_FOUND,
            });
        }

        return product;
    }

    async findMany(options: { sort; limit }): Promise<Product[]> {
        const products = await this.productModel
            .find({})
            .sort(options.sort)
            .limit(options.limit);

        return products;
    }

    async createOne(data: ProductCreateReqDto): Promise<Product> {
        const product = await this.productModel.create(data);

        return product;
    }

    async updateOne(id: string, data: ProductUpdateReqDto): Promise<Product> {
        const product = await this.productModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!product) {
            throw new NotFoundException({
                message: `Product with id: ${id} was not found`,
                statuscode: HttpStatus.NOT_FOUND,
            });
        }

        return product;
    }

    async deleteOne(id: string): Promise<Product> {
        const product = await this.productModel.findOneAndDelete({ _id: id });

        if (!product) {
            throw new NotFoundException({
                message: `Product with id: ${id} was not found`,
                statuscode: HttpStatus.NOT_FOUND,
            });
        }

        return product;
    }
}
