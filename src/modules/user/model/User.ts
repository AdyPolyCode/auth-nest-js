import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({
        type: String,
        unique: true,
        trim: true,
        min: 4,
        max: 16,
        required: true,
    })
    username: string;

    @Prop({
        type: String,
        unique: true,
        trim: true,
        required: true,
    })
    email: string;

    @Prop({
        type: String,
        required: true,
    })
    hashedPassword: string;

    @Prop({
        type: String,
        unique: true,
        required: true,
    })
    salt: string;

    @Prop({
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    })
    role: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
