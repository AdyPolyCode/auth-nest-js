import { Module } from '@nestjs/common';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import ConfigService from './config.service';
import EncryptionService from './encryption.service';
import MailService from './mail.service';
import MessageQueueService from './message-queue.service';

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'exOne',
                    type: 'direct',
                },
            ],
            uri: 'amqp://localhost:5672',
        }),
    ],
    providers: [
        ConfigService,
        EncryptionService,
        MailService,
        MessageQueueService,
    ],
    exports: [
        ConfigService,
        EncryptionService,
        MessageQueueService,
        MailService,
    ],
})
export default class SharedModule {}
