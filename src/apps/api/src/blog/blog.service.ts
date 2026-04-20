import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './blog.model';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogRepository: Repository<BlogPost>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const existing = await this.blogRepository.findOne({ where: { slug: createBlogPostDto.slug } });
    if (existing) {
      throw new ConflictException('Blog post with this slug already exists');
    }
    const post = this.blogRepository.create(createBlogPostDto);
    return this.blogRepository.save(post);
  }

  async findAll(publishedOnly = true): Promise<BlogPost[]> {
    const query: any = {};
    if (publishedOnly) {
      query.isPublished = true;
    }
    return this.blogRepository.find({
      where: query,
      order: { createdAt: 'DESC' },
    });
  }

  async findOneBySlug(slug: string): Promise<BlogPost> {
    const post = await this.blogRepository.findOne({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Blog post with slug ${slug} not found`);
    }
    return post;
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.blogRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const post = await this.findOne(id);
    Object.assign(post, updateBlogPostDto);
    return this.blogRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.blogRepository.remove(post);
  }
}
