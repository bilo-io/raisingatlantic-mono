import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ExamplesService } from './examples.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { Example } from './examples.model';

@Controller('examples')
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Post()
  async create(@Body() dto: CreateExampleDto): Promise<Example> {
    return this.examplesService.create(dto);
  }

  @Get()
  async findAll(): Promise<Example[]> {
    return this.examplesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Example> {
    return this.examplesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExampleDto): Promise<Example> {
    return this.examplesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.examplesService.remove(id);
  }
}
