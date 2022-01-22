import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';

@Injectable()
export default class EncryptionService {
    createHash(salt: string, password: string): string {
        const hash = createHmac('sha256', password).update(salt).digest('hex');

        return hash;
    }

    createSalt(): string {
        const salt = randomBytes(16).toString('hex');

        return salt;
    }

    comparePassword(
        salt: string,
        hashedPassword: string,
        password: string
    ): void {
        const hash = this.createHash(salt, password);

        if (hash !== hashedPassword) {
            throw new UnauthorizedException({
                message: 'Invalid credentials',
                statusCode: 401,
            });
        }
    }

    createUniqueTokenString(userId: string): string {
        const uuid =
            randomBytes(16).toString('hex') +
            userId +
            Math.floor(Date.now() / 1000);

        return uuid;
    }
}
