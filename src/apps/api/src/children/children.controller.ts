import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { CreateMedicalConditionDto } from './dto/create-medical-condition.dto';
import { Child } from './children.model';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/constants';

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
  async addCondition(@Param('id') id: string, @Body() dto: CreateMedicalConditionDto) {
    return this.childrenService.addMedicalCondition(id, dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CLINICIAN)
  async update(@Param('id') id: string, @Body() dto: UpdateChildDto): Promise<Child> {
    return this.childrenService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.childrenService.remove(id);
  }
}

