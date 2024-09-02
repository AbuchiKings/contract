import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const { port = 4000 } = configService.get('common');

  // Middleware
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const whitelist = [];

  Logger.log(`These are the approved domains: ${whitelist.join(',')}`);

  // Enable localhost on dev/staging servers only
  if ([undefined, 'development'].includes(process.env.NODE_ENV)) {
    whitelist.push(/http(s)?:\/\/localhost:/);
  }

  // cors options
  const options = {
    origin: whitelist,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-control',
    ],
    credentials: true,
  };

  app.enableCors(options);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));


  await app.listen(port);
  Logger.log(`Server running on ${port}`);
}

bootstrap();
