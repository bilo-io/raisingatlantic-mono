import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MetricsService, VaccinationsDueSnapshot } from './metrics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/constants';

@Controller('metrics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  // Invoked by a scheduled job (Cloud Scheduler with an OIDC token) to refresh
  // point-in-time business gauges. Not a public endpoint.
  @Post('refresh')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  refresh(): Promise<VaccinationsDueSnapshot> {
    return this.metricsService.emitBusinessGauges();
  }
}
