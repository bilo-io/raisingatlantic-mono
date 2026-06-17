import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeatureRequestsService } from './feature-requests.service';
import type { PublicFeatureRequest } from './feature-requests.service';
import { CreateFeatureRequestDto } from './dto/create-feature-request.dto';
import { VoteFeatureRequestDto } from './dto/vote-feature-request.dto';

/**
 * Public, unauthenticated feature-request board for the PediCheck landing site.
 * Backed by a Google Sheet (not Postgres). No auth guards by design; abuse is
 * blunted with per-route throttling, and submissions are held as PENDING until
 * a human approves them in the Sheet.
 */
@ApiTags('Feature Requests')
@Controller('feature-requests')
export class FeatureRequestsController {
  constructor(
    private readonly featureRequestsService: FeatureRequestsService,
  ) {}

  @Post()
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit a feature request (held for review)' })
  @ApiResponse({ status: 201, description: 'Feature request submitted' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async create(@Body() dto: CreateFeatureRequestDto): Promise<{ id: string }> {
    return this.featureRequestsService.create(dto);
  }

  @Get()
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'List approved feature requests (newest first)' })
  async list(): Promise<PublicFeatureRequest[]> {
    return this.featureRequestsService.list();
  }

  @Post(':id/vote')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Upvote or downvote a feature request' })
  @ApiResponse({ status: 404, description: 'Feature request not found' })
  async vote(
    @Param('id') id: string,
    @Body() dto: VoteFeatureRequestDto,
  ): Promise<{ value: number }> {
    return this.featureRequestsService.vote(id, dto.direction);
  }
}
