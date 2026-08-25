import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    type: [String],
    example: ['9f1c0b2a-4e6d-4a2b-8c1e-2d3f4a5b6c7d'],
    description:
      'User IDs of the other participants. The caller is always added automatically.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participantIds: string[];
}
