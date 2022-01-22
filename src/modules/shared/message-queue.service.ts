import { Injectable } from '@nestjs/common';

import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import MailService from './mail.service';

@Injectable()
export default class MessageQueueService {
    constructor(
        private connection: AmqpConnection,
        private mailService: MailService
    ) {}

    public async publish(
        exchange: string,
        routingKey: string,
        message: {}
    ): Promise<void> {
        this.connection.publish(exchange, routingKey, message);
    }

    @RabbitSubscribe({
        exchange: 'exOne',
        queue: 'qOne',
        routingKey: 'mail-confirmation',
        allowNonJsonMessages: true,
    })
    private async subForConfirm(message: {
        email: string;
        tokenString: string;
        type: string;
    }): Promise<void> {
        const { email, tokenString, type } = message;

        this.mailService.sendMail(email, tokenString, type);
    }

    @RabbitSubscribe({
        exchange: 'exOne',
        queue: 'qTwo',
        routingKey: 'password-reset',
        allowNonJsonMessages: true,
    })
    private async subForReset(message: {
        email: string;
        tokenString: string;
        type: string;
    }): Promise<void> {
        const { email, tokenString, type } = message;

        this.mailService.sendMail(email, tokenString, type);
    }
}
