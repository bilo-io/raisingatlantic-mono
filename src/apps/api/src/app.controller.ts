import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
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

  @Get('api/dashboard')
  getDashboard(@Req() req: Request) {
    const userId = req.cookies['currentUserId'] || 'user-1'; // Default to parent-1 or similar
    // Mock user identification. This would eventually be a DB call based on session/JWT.
    return {
      userId,
      isLoadedFromApi: true,
      timestamp: new Date().toISOString(),
      // In a real scenario, this would dynamically determine role and return correct stats.
    };
  }
}
