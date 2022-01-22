import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { readFileSync } from 'fs';
import { compile } from 'handlebars';

import ConfigService from './config.service';

@Injectable()
export default class MailService {
    constructor(private configService: ConfigService) {}

    private createMessage(type: string, url: string): string {
        const { message } = this.configService.sendMailSetting(type);

        return message.concat(url);
    }

    private createTemplate(type: string, url: string): string {
        const { templatePath } = this.configService.sendMailSetting(type);

        const templateFile = readFileSync(templatePath, {
            encoding: 'utf-8',
        });

        const template = compile(templateFile)({ URL: url });

        return template;
    }

    public createUrl(type: string, tokenString: string): string {
        const { host, urlPath } = this.configService.sendMailSetting(type);

        const url = `http://${host}${urlPath}/${tokenString}`;

        return url;
    }

    public async sendMail(
        email: string,
        tokenString: string,
        type: string
    ): Promise<void> {
        try {
            const url = this.createUrl(type, tokenString);

            const template = this.createTemplate(type, url);

            const sendMessage = this.createMessage(type, url);

            const transporterConfig = this.configService.mailConfig;

            const transporter = createTransport(transporterConfig);

            const dataToPublish = {
                from: this.configService.getKey('MAIL_FROM'),
                to: email,
                subject: type,
                text: sendMessage,
                html: template,
            };

            await transporter.sendMail(dataToPublish);
        } catch (error) {
            console.log(error.stack);
            throw new HttpException(
                {
                    message: 'Could not sent email',
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
