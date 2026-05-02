import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use Pino as the application logger (replaces the default NestJS logger)
  app.useLogger(app.get(Logger));

  app.use(cookieParser());

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS — in dev allow any localhost port, in prod restrict to FRONTEND_URL
  const isDev = process.env.NODE_ENV !== 'production';
  app.enableCors({
    origin: isDev ? /^http:\/\/localhost(:\d+)?$/ : process.env.FRONTEND_URL,
    credentials: true,
  });

  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use('/api/uploads', express.static(path.join(process.cwd(), uploadDir)));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
