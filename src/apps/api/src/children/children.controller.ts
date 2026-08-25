import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ChildrenService, type RecordActor } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { CreateMedicalConditionDto } from './dto/create-medical-condition.dto';
import { CreateCompletedVaccinationDto } from './dto/create-completed-vaccination.dto';
import { CreateGrowthRecordDto } from './dto/create-growth-record.dto';
import { CreateCompletedMilestoneDto } from './dto/create-completed-milestone.dto';
import { Child } from './children.model';
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

@Controller('children')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN)
  async create(@Body() dto: CreateChildDto): Promise<Child> {
    return this.childrenService.create(dto);
  }

  @Get()
  async findAll(
    @Query('tenantId') tenantId?: string,
    @Query('clinicianId') clinicianId?: string,
  ): Promise<Child[]> {
    return this.childrenService.findAll({ tenantId, clinicianId });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Child> {
    return this.childrenService.findOne(id);
  }

  @Get(':id/records')
  async getUnifiedRecords(@Param('id') id: string) {
    return this.childrenService.findUnifiedRecords(id);
  }

  @Post(':id/allergies')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN)
  async addAllergy(@Param('id') id: string, @Body() dto: CreateAllergyDto) {
    return this.childrenService.addAllergy(id, dto);
  }

  @Post(':id/conditions')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN)
  async addCondition(
    @Param('id') id: string,
    @Body() dto: CreateMedicalConditionDto,
  ) {
    return this.childrenService.addMedicalCondition(id, dto);
  }

  @Post(':id/growth')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN, UserRole.PARENT)
  async addGrowthRecord(
    @Param('id') id: string,
    @Body() dto: CreateGrowthRecordDto,
    @Req() req: AuthedRequest,
  ) {
    return this.childrenService.addGrowthRecord(id, dto, actorFrom(req));
  }

  @Post(':id/milestones')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN, UserRole.PARENT)
  async addCompletedMilestone(
    @Param('id') id: string,
    @Body() dto: CreateCompletedMilestoneDto,
    @Req() req: AuthedRequest,
  ) {
    return this.childrenService.addCompletedMilestone(id, dto, actorFrom(req));
  }

  @Post(':id/vaccinations')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN, UserRole.PARENT)
  async addCompletedVaccination(
    @Param('id') id: string,
    @Body() dto: CreateCompletedVaccinationDto,
    @Req() req: AuthedRequest,
  ) {
    return this.childrenService.addCompletedVaccination(
      id,
      dto,
      actorFrom(req),
    );
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateChildDto,
  ): Promise<Child> {
    return this.childrenService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.childrenService.remove(id);
  }
}
