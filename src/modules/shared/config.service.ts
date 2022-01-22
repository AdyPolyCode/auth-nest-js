import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

import { MongooseModuleOptions } from '@nestjs/mongoose';

import { join } from 'path';

import { MAILSETTING } from '../../common/types/mail-config-setting';

import { MAILCONFIG } from '../../common/types/mail-config';

@Injectable()
export default class ConfigService {
    constructor() {
        dotenv.config({});
    }

    public getKey(key: string): string {
        return process.env[key];
    }

    public get mongoConfig(): MongooseModuleOptions {
        return {
            uri: process.env['MONGO_URI'],
            retryAttempts: 3,
            retryDelay: 3000,
        };
    }

    public get mailConfig(): MAILCONFIG {
        return {
            host: process.env['MAIL_HOST'],
            port: Number(process.env['MAIL_PORT']),
            secure: false,
            auth: {
                user: process.env['MAIL_USER'],
                pass: process.env['MAIL_PASS'],
            },
        };
    }

    private get mailConfirmSetting(): MAILSETTING {
        return {
            host: `${process.env.NODE_HOST}:${process.env.NODE_PORT}`,
            urlPath: '/api/auth/mail-confirmation',
            templatePath: join(__dirname, 'templates/mail-confirmation.hbs'),
            message:
                'Please confirm this email so you can enjoy our services - ',
            queueName: 'confirmation',
        };
    }

    private get passwordResetSetting(): MAILSETTING {
        return {
            host: `${process.env.NODE_HOST}:${process.env.NODE_PORT}`,
            urlPath: '/api/auth/password-reset',
            templatePath: join(__dirname, 'templates/password-reset.hbs'),
            message: 'Here is your reset password email - ',
            queueName: 'reset',
        };
    }

    public sendMailSetting(type: string): MAILSETTING {
        if (type === 'mail-confirmation') {
            return this.mailConfirmSetting;
        } else {
            return this.passwordResetSetting;
        }
    }
}
