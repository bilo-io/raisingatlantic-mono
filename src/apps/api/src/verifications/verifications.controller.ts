import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  VerificationsService,
  type RecordActor,
} from './verifications.service';
import { VerificationDecisionDto } from './dto/verification-decision.dto';
import {
  JwtAuthGuard,
  type AuthTokenPayload,
} from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/constants';

interface AuthedRequest extends Request {
  user?: AuthTokenPayload;
}

function actorFrom(req: AuthedRequest): RecordActor | undefined {
  return req.user
    ? { userId: req.user.sub, role: req.user.role as UserRole }
    : undefined;
}

@Controller('verifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Get('clinicians')
  findAllClinicians() {
    return this.verificationsService.findAllCliniciansForVerification();
  }

  @Get('records')
  findAllRecords() {
    return this.verificationsService.findAllRecordsForVerification();
  }

  @Patch('records/:id')
  decideRecord(
    @Param('id') id: string,
    @Body() dto: VerificationDecisionDto,
    @Req() req: AuthedRequest,
  ) {
    return this.verificationsService.decideRecord(id, dto, actorFrom(req));
  }

  // Clinician HPCSA/SANC verification is an admin responsibility — a clinician
  // must not be able to approve their own (or a peer's) registration.
  @Patch('clinicians/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  decideClinician(
    @Param('id') id: string,
    @Body() dto: VerificationDecisionDto,
  ) {
    return this.verificationsService.decideClinician(id, dto);
  }
}
