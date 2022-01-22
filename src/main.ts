import { NestFactory } from '@nestjs/core';

import {
    ExpressAdapter,
    NestExpressApplication,
} from '@nestjs/platform-express';

import MainModule from './modules/main.module';

async function start(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(
        MainModule,
        new ExpressAdapter()
    );

    app.enableCors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });

    await app.listen(process.env.NODE_PORT, () => {
        console.log(`Server is listening at port: ${process.env.NODE_PORT}`);
    });
}

start();
