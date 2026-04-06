import { CreateExampleDto } from './create-example.dto';

export class UpdateExampleDto implements Partial<CreateExampleDto> {
  name?: string;
  description?: string;
}
