import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response } from 'express';

let appPromise: Promise<NestExpressApplication> | null = null;

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (!process.env.VERCEL) {
    app.useStaticAssets(join(__dirname, '..', 'public'));
  }

  app.use(cookieParser());

  const isProd = process.env.NODE_ENV === 'production';
  const builtInOrigins = [
    'http://localhost:9002',
    'https://raisingatlantic-web.vercel.app',
    'https://raisingatlantic-web-dev.vercel.app',
    'https://raisingatlantic-dev.vercel.app',
    'https://raisingatlantic-staging.vercel.app',
    'https://raisingatlantic-prod.vercel.app',
    'https://raisingatlantic.vercel.app',
  ];
  const extraOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const allowedOrigins = [...new Set([...builtInOrigins, ...extraOrigins])];
  app.enableCors({
    // In dev: allow any origin (LAN IPs from mobile sim/device, Expo Go, etc.).
    // In prod: enforce explicit allowlist; extend via ALLOWED_ORIGINS env var.
    origin: isProd ? allowedOrigins : true,
    credentials: true,
  });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

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

  app.getHttpAdapter().get('/v1/api-json', (req: Request, res: Response) => {
    res.json(document);
  });

  await app.init();
  return app;
}

async function getApp(): Promise<NestExpressApplication> {
  if (!appPromise) appPromise = bootstrap();
  return appPromise;
}

async function handler(req: Request, res: Response): Promise<void> {
  const app = await getApp();
  const expressInstance = app.getHttpAdapter().getInstance() as (
    req: Request,
    res: Response,
  ) => void;
  expressInstance(req, res);
}

export default handler;
module.exports = handler;
module.exports.default = handler;

if (!process.env.VERCEL) {
  getApp().then(async (app) => {
    await app.listen(process.env.PORT ?? 3000);
  });
}
