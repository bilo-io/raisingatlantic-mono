import { Injectable, NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { CORRELATION_HEADER } from '../logging/logger.config';

export const CLS_REQUEST_ID_KEY = 'requestId';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.header(CORRELATION_HEADER);
    const id = incoming && incoming.trim() ? incoming.trim() : randomUUID();

    res.setHeader(CORRELATION_HEADER, id);
    this.cls.set(CLS_REQUEST_ID_KEY, id);

    next();
  }
}
