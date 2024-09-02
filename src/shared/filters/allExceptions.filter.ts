import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const message = exception.getResponse() as {
      key: string;
      args: Record<string, any>;
    };

    this.logger.error({ statusCode, message });
    response.status(statusCode).json({ statusCode, message });
  }
}
