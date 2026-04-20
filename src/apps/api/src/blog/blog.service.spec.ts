import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogPost } from './blog.model';
import { createMockRepository } from '../common/test/test-utils';

describe('BlogService', () => {
  let service: BlogService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: getRepositoryToken(BlogPost), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    repo = module.get(getRepositoryToken(BlogPost));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a blog post', async () => {
      const dto = { title: 'Test', slug: 'test', shortDescription: 'desc', synopsis: 'syn', body: 'body', isPublished: false };
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(dto);
      repo.save.mockResolvedValue({ id: 'uuid1', ...dto });

      const result = await service.create(dto as any);
      expect(result.id).toBe('uuid1');
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if slug already exists', async () => {
      repo.findOne.mockResolvedValue({ id: 'existing', slug: 'test' });
      await expect(service.create({ slug: 'test' } as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return only published posts when publishedOnly=true', async () => {
      repo.find.mockResolvedValue([{ id: '1', isPublished: true }]);
      const result = await service.findAll(true);
      expect(repo.find).toHaveBeenCalledWith(expect.objectContaining({ where: { isPublished: true } }));
      expect(result.length).toBe(1);
    });

    it('should return all posts when publishedOnly=false', async () => {
      repo.find.mockResolvedValue([{ id: '1' }, { id: '2' }]);
      const result = await service.findAll(false);
      expect(repo.find).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
      expect(result.length).toBe(2);
    });
  });

  describe('findOneBySlug', () => {
    it('should return a post by slug', async () => {
      const post = { id: 'uuid1', slug: 'my-post' };
      repo.findOne.mockResolvedValue(post);
      const result = await service.findOneBySlug('my-post');
      expect(result).toEqual(post);
    });

    it('should throw NotFoundException if slug not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOneBySlug('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const post = { id: 'uuid1', title: 'Test' };
      repo.findOne.mockResolvedValue(post);
      const result = await service.findOne('uuid1');
      expect(result).toEqual(post);
    });

    it('should throw NotFoundException if id not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the post', async () => {
      const post = { id: 'uuid1', title: 'Old' };
      const updated = { id: 'uuid1', title: 'New' };
      repo.findOne.mockResolvedValue(post);
      repo.save.mockResolvedValue(updated);

      const result = await service.update('uuid1', { title: 'New' } as any);
      expect(result.title).toBe('New');
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove the post', async () => {
      const post = { id: 'uuid1' };
      repo.findOne.mockResolvedValue(post);
      repo.remove.mockResolvedValue(undefined);

      await service.remove('uuid1');
      expect(repo.remove).toHaveBeenCalledWith(post);
    });
  });
});
