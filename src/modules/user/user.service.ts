import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './model/User';

import UserUpdateReqDto from './dtos/user-update';

import TokenService from '../token/token.service';

@Injectable()
export default class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private tokenService: TokenService
    ) {}

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id);

        if (!user) {
            throw new NotFoundException({
                message: `User with id: ${id} was not found`,
                statusCode: 404,
            });
        }

        return user;
    }

    async findMany(): Promise<User[]> {
        const users = await this.userModel.find({});

        return users;
    }

    async createOne(
        username: string,
        email: string,
        hashedPassword: string,
        salt: string
    ): Promise<User> {
        const user = await this.userModel.create({
            username,
            email,
            hashedPassword,
            salt,
        });

        return user;
    }

    async updateOne(id: string, data: UserUpdateReqDto): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!user) {
            throw new NotFoundException({
                message: `User with id: ${id} was not found`,
                statusCode: 404,
            });
        }

        return user;
    }

    async deleteOne(id: string): Promise<User> {
        const user = await this.userModel.findByIdAndDelete(id);

        if (!user) {
            throw new NotFoundException({
                message: `User with id: ${id} was not found`,
                statusCode: 404,
            });
        }

        return user;
    }

    async findByTokenString(tokenString: string): Promise<User> {
        const token = await this.tokenService.findByTokenString(tokenString);

        const user = await this.userModel.findOne({
            _id: token.user.toString(),
            isVerified: true,
        });

        if (!user) {
            throw new UnauthorizedException({
                message: `${tokenString} is invalid`,
                statusCode: 401,
            });
        }

        return user;
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ email: email });

        if (!user) {
            throw new NotFoundException({
                message: `User with email: ${email} was not found`,
                statusCode: 404,
            });
        }

        return user;
    }

    async verifyOne(id: string): Promise<void> {
        await this.userModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    isVerified: true,
                },
            }
        );
    }
}
