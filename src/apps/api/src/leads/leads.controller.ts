import { Controller, Post, Body, Req } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  // Public, unauthenticated form: cap at 3 submissions / minute per IP to
  // blunt scrapers and spam without hurting legitimate users.
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit a lead contact form' })
  @ApiResponse({ status: 201, description: 'Lead successfully submitted' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async create(@Body() createLeadDto: CreateLeadDto, @Req() req: Request) {
    const ip = req.ip;
    return this.leadsService.create(createLeadDto, ip);
  }
}
