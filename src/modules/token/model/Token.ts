import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
    @Prop({
        type: String,
        unique: true,
        required: true,
    })
    tokenString: string;

    @Prop({
        type: Boolean,
        default: true,
    })
    isActive: boolean;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    user: string;

    @Prop({
        type: String,
        default: '',
    })
    deactivatedAt: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
