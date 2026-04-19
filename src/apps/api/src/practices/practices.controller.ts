import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { Practice } from './practices.model';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/constants';

@Controller('practices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) {}

  @Get('public')
  async findAllPublic(): Promise<Practice[]> {
    return this.practicesService.findAllPublic();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() dto: CreatePracticeDto): Promise<Practice> {
    return this.practicesService.create(dto);
  }

  @Get()
  async findAll(): Promise<Practice[]> {
    return this.practicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Practice> {
    return this.practicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdatePracticeDto): Promise<Practice> {
    return this.practicesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.practicesService.remove(id);
  }
}

