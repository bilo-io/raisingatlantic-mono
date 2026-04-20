import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

describe('BlogController', () => {
  let controller: BlogController;
  let service: Partial<BlogService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOneBySlug: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [{ provide: BlogService, useValue: service }],
    }).compile();

    controller = module.get<BlogController>(BlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { title: 'Test', slug: 'test', shortDescription: 'd', synopsis: 's', body: 'b' };
      await controller.create(dto as any);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with publishedOnly=true', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalledWith(true);
    });
  });

  describe('findAllAdmin', () => {
    it('should call service.findAll with publishedOnly=false', async () => {
      await controller.findAllAdmin();
      expect(service.findAll).toHaveBeenCalledWith(false);
    });
  });

  describe('findOneBySlug', () => {
    it('should call service.findOneBySlug with slug', async () => {
      await controller.findOneBySlug('my-post');
      expect(service.findOneBySlug).toHaveBeenCalledWith('my-post');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      await controller.findOne('uuid1');
      expect(service.findOne).toHaveBeenCalledWith('uuid1');
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { title: 'Updated' };
      await controller.update('uuid1', dto as any);
      expect(service.update).toHaveBeenCalledWith('uuid1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      await controller.remove('uuid1');
      expect(service.remove).toHaveBeenCalledWith('uuid1');
    });
  });
});
