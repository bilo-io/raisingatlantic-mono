import { ExamplesService } from './examples.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

/**
 * Controller class (Mocking standard REST framework such as NestJS or Express)
 */
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  async create(dto: CreateExampleDto) {
    try {
      const example = await this.examplesService.create(dto);
      return { statusCode: 201, data: example };
    } catch (error) {
      return { statusCode: 500, message: (error as Error).message };
    }
  }

  async findAll() {
    const data = await this.examplesService.findAll();
    return { statusCode: 200, data };
  }

  async findOne(id: string) {
    const data = await this.examplesService.findOne(id);
    if (!data) {
      return { statusCode: 404, message: `Example with ID: ${id} not found` };
    }
    return { statusCode: 200, data };
  }

  async update(id: string, dto: UpdateExampleDto) {
    const data = await this.examplesService.update(id, dto);
    if (!data) {
      return { statusCode: 404, message: `Cannot update - Example with ID: ${id} not found` };
    }
    return { statusCode: 200, data };
  }

  async remove(id: string) {
    const isDeleted = await this.examplesService.remove(id);
    if (!isDeleted) {
      return { statusCode: 404, message: `Cannot delete - Example with ID: ${id} not found` };
    }
    return { statusCode: 204, message: 'Successfully removed' };
  }
}
