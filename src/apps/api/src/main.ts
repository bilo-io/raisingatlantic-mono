import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:9002', 
      'https://raisingatlantic-dev.vercel.app',
      'https://raisingatlantic-staging.vercel.app',
      'https://raisingatlantic-prod.vercel.app',
      'https://raisingatlantic.vercel.app'
    ],
    credentials: true,
  });
  app.setGlobalPrefix('v1');

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Raising Atlantic API')
    .setDescription('The Raising Atlantic API description')
    .setVersion('1.0')
    .addTag('RaisingAtlantic')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);

  // Allow exporting the raw JSON
  app.getHttpAdapter().get('/v1/api-json', (req, res) => {
    res.json(document);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
