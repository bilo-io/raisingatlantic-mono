import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'The Future of Pediatric Health' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'the-future-of-pediatric-health' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiProperty({ example: 'Discover how digital tools are transforming childcare.' })
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'This post explores the advent of AI in South African clinics.' })
  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @ApiProperty({ example: '# The Future...\n\nMarkdown content here.' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: true, default: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}
