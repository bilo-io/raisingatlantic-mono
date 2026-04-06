import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:9002', 'https://raisingatlantic-dev.vercel.app'],
    credentials: true,
  });
  app.setGlobalPrefix('v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
