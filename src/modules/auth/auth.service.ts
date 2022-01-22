import { Injectable } from '@nestjs/common';

import EncryptionService from '../shared/encryption.service';

import TokenService from '../token/token.service';
import UserService from '../user/user.service';
import MailService from '../shared/mail.service';
import MessageQueueService from '../shared/message-queue.service';

import { User } from '../user/model/User';
import { Token } from '../token/model/Token';

import { RegisterReqDto, LoginReqDto, ChangePasswordReqDto } from './dtos';

@Injectable()
export default class AuthService {
    constructor(
        private encryptionService: EncryptionService,
        private tokenService: TokenService,
        private userService: UserService,
        private mailService: MailService,
        private messageQueueService: MessageQueueService
    ) {}

    async register(
        data: RegisterReqDto
    ): Promise<{ user: User; authToken: Token; url }> {
        const { username, email, password } = data;

        const salt = this.encryptionService.createSalt();

        const hash = this.encryptionService.createHash(salt, password);

        const user = await this.userService.createOne(
            username,
            email,
            hash,
            salt
        );

        const authToken = await this.tokenService.createOne(user._id);

        const mailToken = await this.tokenService.createOne(user._id);

        const url = this.mailService.createUrl(
            'mail-confirmation',
            mailToken.tokenString
        );

        this.messageQueueService.publish('exOne', 'mail-confirmation', {
            email: user.email,
            tokenString: mailToken.tokenString,
            type: 'mail-confirmation',
        });

        return {
            user,
            authToken,
            url,
        };
    }

    async login(data: LoginReqDto): Promise<{ user: User; authToken: Token }> {
        const { email, password } = data;

        const user = await this.userService.findByEmail(email);

        this.encryptionService.comparePassword(
            user.salt,
            user.hashedPassword,
            password
        );

        const authToken = await this.tokenService.createOne(user._id);

        return {
            user,
            authToken,
        };
    }

    async logout(tokenString: string): Promise<void> {
        await this.userService.findByTokenString(tokenString);

        await this.tokenService.deactivateOne(tokenString);
    }

    async changePassword(
        tokenString: string,
        data: ChangePasswordReqDto
    ): Promise<void> {
        const { password } = data;

        const user = await this.userService.findByTokenString(tokenString);

        const hash = this.encryptionService.createHash(user.salt, password);

        await user.update({
            $set: {
                hashedPassword: hash,
            },
        });

        await this.tokenService.deactivateOne(tokenString);
    }

    async forgotPassword(email: string): Promise<string> {
        const user = await this.userService.findByEmail(email);

        const mailToken = await this.tokenService.createOne(user._id);

        const url = this.mailService.createUrl(
            'password-reset',
            mailToken.tokenString
        );

        this.messageQueueService.publish('exOne', 'password-reset', {
            email: user.email,
            tokenString: mailToken.tokenString,
            type: 'password-reset',
        });

        return url;
    }

    async confirmMail(tokenString: string): Promise<void> {
        const user = await this.userService.findByTokenString(tokenString);

        await this.userService.verifyOne(user._id);

        await this.tokenService.deactivateMany(user._id);
    }
}
