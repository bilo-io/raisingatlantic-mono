import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PrivacyService, DsarExport } from './privacy.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/constants';

@Controller('privacy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  // DSAR + data-portability export. SECURITY (Phase 2 auth): once real auth
  // populates req.user, this MUST enforce that the caller is the data subject
  // (userId === req.user.id) or an ADMIN fulfilling the request — a subject
  // must never be able to export another subject's personal data.
  @Get('export/:userId')
  @Roles(
    UserRole.PARENT,
    UserRole.CLINICIAN,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  exportUserData(@Param('userId') userId: string): Promise<DsarExport> {
    return this.privacyService.exportUserData(userId);
  }
}
