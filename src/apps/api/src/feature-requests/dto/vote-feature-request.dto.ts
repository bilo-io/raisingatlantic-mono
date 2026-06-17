import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type VoteDirection = 'up' | 'down';

export class VoteFeatureRequestDto {
  @ApiProperty({ enum: ['up', 'down'], example: 'up' })
  @IsIn(['up', 'down'])
  direction: VoteDirection;
}
