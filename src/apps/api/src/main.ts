import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(cookieParser());
  const isProd = process.env.NODE_ENV === 'production';
  const allowedOrigins = [
    'http://localhost:9002',
    'https://raisingatlantic-dev.vercel.app',
    'https://raisingatlantic-staging.vercel.app',
    'https://raisingatlantic-prod.vercel.app',
    'https://raisingatlantic.vercel.app',
  ];
  app.enableCors({
    // In dev: allow any origin (LAN IPs from mobile sim/device, Expo Go, etc.).
    // In prod: enforce explicit allowlist.
    origin: isProd ? allowedOrigins : true,
    credentials: true,
  });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Raising Atlantic API')
    .setDescription('The Raising Atlantic API description')
    .setVersion('1.0')
    .addTag('RaisingAtlantic')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document, {
    customfavIcon: '/favicon.ico',
  });

  // Allow exporting the raw JSON
  app.getHttpAdapter().get('/v1/api-json', (req: Request, res: Response) => {
    res.json(document);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
