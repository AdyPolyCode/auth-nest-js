import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// TODO: add pagination

@Injectable()
export class QueryBuilder implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { limit, page } = req.query;

        const baseOptions = {
            limit: '4',
            page: '1',
            sort: {
                createdAt: 'desc',
            },
        };

        if (limit && Number(limit) < 5) {
            baseOptions.limit = String(limit);
        }

        if (page) {
            baseOptions.page = String(page);
        }

        req.query = baseOptions;

        next();
    }
}
