import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
    @Prop({
        type: String,
        unique: true,
        trim: true,
        min: 4,
        max: 20,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
        trim: true,
        min: 10,
        max: 200,
        required: true,
    })
    description: string;

    @Prop({
        type: Number,
        required: true,
    })
    price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
