import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('favicon.ico')
  getFavicon(@Res() res: Response) {
    // In dev: process.cwd() is project root, look in public/
    // In prod: process.cwd() still root, nest-cli copies assets to dist/public/
    const isProd = process.env.NODE_ENV === 'production';
    const filePath = isProd 
      ? join(process.cwd(), 'dist', 'public', 'favicon.ico')
      : join(process.cwd(), 'public', 'favicon.ico');
    res.sendFile(filePath);
  }
}
