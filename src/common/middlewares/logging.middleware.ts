import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Response');

  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const reqTime = new Date().getTime(); // Record request start time

    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime(); // Record response end time
      const responseTime = resTime - reqTime;

      // Log successful responses
      if (statusCode === 201 || statusCode === 200) {
        this.logger.log(`${method} ${url} ${statusCode} - ${responseTime} ms`);
      }
    });

    next(); // Pass control to the next middleware
  }
}
