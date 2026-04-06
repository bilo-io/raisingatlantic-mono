import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Child } from './children.model';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  async create(@Body() dto: CreateChildDto): Promise<Child> {
    return this.childrenService.create(dto);
  }

  @Get()
  async findAll(): Promise<Child[]> {
    return this.childrenService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Child> {
    return this.childrenService.findOne(id);
  }

  @Get(':id/records')
  async getUnifiedRecords(@Param('id') id: string) {
    return this.childrenService.findUnifiedRecords(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateChildDto): Promise<Child> {
    return this.childrenService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.childrenService.remove(id);
  }
}
