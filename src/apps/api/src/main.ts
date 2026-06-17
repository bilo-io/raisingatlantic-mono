// MUST be the very first import — initialises Sentry then OpenTelemetry
// before any other module is required, so auto-instrumentations can patch.
import './instrumentation';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response } from 'express';

let appPromise: Promise<NestExpressApplication> | null = null;

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Replace the default Nest logger with the configured Pino logger so framework
  // log lines also flow through JSON + redaction + Cloud Logging.
  app.useLogger(app.get(Logger));

  if (!process.env.VERCEL) {
    app.useStaticAssets(join(__dirname, '..', 'public'));
  }

  app.use(cookieParser());

  const isProd = process.env.NODE_ENV === 'production';
  // CSP is intentionally disabled: this is a JSON API and Swagger UI ships
  // inline scripts. The Next.js web app owns CSP separately.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      hsts: isProd
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    }),
  );

  const builtInOrigins = [
    'http://localhost:9002',
    'https://raisingatlantic-web.vercel.app',
    'https://raisingatlantic-web-dev.vercel.app',
    'https://raisingatlantic-dev.vercel.app',
    'https://raisingatlantic-staging.vercel.app',
    'https://raisingatlantic-prod.vercel.app',
    'https://raisingatlantic.vercel.app',
    // PediCheck landing site (feature-request board + lead capture).
    'http://localhost:9003',
    'https://pedicheck.co.za',
    'https://www.pedicheck.co.za',
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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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
  if (!appPromise) {
    // Reset on failure so the next invocation can retry instead of
    // serving the same rejected promise for the lifetime of the lambda.
    appPromise = bootstrap().catch((err) => {
      appPromise = null;
      throw err;
    });
  }
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

// @vercel/node probes module.exports and module.exports.default for the
// request handler. Using CommonJS assignment directly (no `export default`)
// avoids tsc's `exports.default = ...` being clobbered by the next line.
module.exports = handler;
module.exports.default = handler;

if (!process.env.VERCEL) {
  getApp().then(async (app) => {
    await app.listen(process.env.PORT ?? 3000);
  });
}
