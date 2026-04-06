import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { Practice } from './practices.model';

@Controller('practices')
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) {}

  @Post()
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
  async update(@Param('id') id: string, @Body() dto: UpdatePracticeDto): Promise<Practice> {
    return this.practicesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.practicesService.remove(id);
  }
}
