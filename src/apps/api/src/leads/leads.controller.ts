import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Submit a lead contact form' })
  @ApiResponse({ status: 201, description: 'Lead successfully submitted' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async create(@Body() createLeadDto: CreateLeadDto, @Req() req: Request) {
    const ip = req.ip;
    return this.leadsService.create(createLeadDto, ip);
  }
}
