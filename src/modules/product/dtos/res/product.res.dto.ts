import { Product } from '../../model/Product';

import { ApiProperty } from '@nestjs/swagger';

import { Types } from 'mongoose';

export class ProductResDto {
    constructor(product: Product) {
        this._id = product._id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
    }

    @ApiProperty({
        description: 'Mongo generated unique ID',
        type: String,
        required: true,
        example: new Types.ObjectId(),
    })
    _id?: string;

    @ApiProperty({
        description: 'User given name',
        type: String,
        required: true,
        example: 'IPhone',
    })
    name: string;

    @ApiProperty({
        description: 'User given item description',
        type: String,
        required: true,
        example: 'High cost but easy use and user friendly design',
    })
    description: string;

    @ApiProperty({
        description: 'User given item price',
        type: Number,
        required: true,
        example: 200,
    })
    price: number;
}
