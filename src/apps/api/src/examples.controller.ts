import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamplesService } from './examples.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Controller('examples')
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Post()
  async create(@Body() dto: CreateExampleDto) {
    try {
      const example = await this.examplesService.create(dto);
      return { statusCode: 201, data: example };
    } catch (error) {
      return { statusCode: 500, message: (error as Error).message };
    }
  }

  @Get()
  async findAll() {
    const data = await this.examplesService.findAll();
    return { statusCode: 200, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.examplesService.findOne(id);
    if (!data) {
      return { statusCode: 404, message: `Example with ID: ${id} not found` };
    }
    return { statusCode: 200, data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateExampleDto) {
    const data = await this.examplesService.update(id, dto);
    if (!data) {
      return { statusCode: 404, message: `Cannot update - Example with ID: ${id} not found` };
    }
    return { statusCode: 200, data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isDeleted = await this.examplesService.remove(id);
    if (!isDeleted) {
      return { statusCode: 404, message: `Cannot delete - Example with ID: ${id} not found` };
    }
    return { statusCode: 204, message: 'Successfully removed' };
  }
}
