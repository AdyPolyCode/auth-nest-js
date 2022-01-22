import { Product } from '../../model/Product';

export class ProductResDto {
    constructor(product: Product) {
        this._id = product._id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
    }

    _id?: string;

    name: string;

    description: string;

    price: number;
}
