import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  constructor() {
    morgan.token('body', (req: Request) => JSON.stringify(req.body));
  }

  use(req: Request, res: Response, next: NextFunction) {
    return morgan(
      ':method :url :status :response-time ms - :res[content-length] :body',
      {
        stream: {
          write: (message) => this.logger.log(message.trim()),
        },
      },
    )(req, res, next);
  }
} 