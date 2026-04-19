import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExampleDto {
  @ApiProperty({ example: 'Test Example' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'This is a test description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
