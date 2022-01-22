import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Token } from './model/Token';

import EncryptionService from '../shared/encryption.service';

@Injectable()
export default class TokenService {
    constructor(
        @InjectModel(Token.name)
        private tokenModel: Model<Token>,
        private encryptionService: EncryptionService
    ) {}

    async createOne(userId: string): Promise<Token> {
        const tokenString =
            this.encryptionService.createUniqueTokenString(userId);

        const token = await this.tokenModel.create({
            tokenString,
            user: userId,
        });

        return token;
    }

    async deactivateOne(tokenString: string): Promise<void> {
        const token = await this.tokenModel.findOne({ tokenString });

        await token.updateOne({ $set: { isActive: false } });
    }

    async deactivateMany(userId: string): Promise<void> {
        await this.tokenModel.updateMany(
            { userId: userId },
            {
                $set: {
                    isActive: false,
                },
            }
        );
    }

    async findByTokenString(tokenString: string): Promise<Token> {
        const token = await this.tokenModel.findOne({
            tokenString: tokenString,
            isActive: true,
        });

        if (!token) {
            throw new UnauthorizedException({
                message: `${tokenString} is invalid`,
                statusCode: 401,
            });
        }

        return token;
    }
}
