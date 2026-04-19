import { Repository, ObjectLiteral } from 'typeorm';

export const createMockLogger = () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
});

export const createMockTracer = () => ({
  startSpan: jest.fn().mockReturnValue({ end: jest.fn() }),
  endSpan: jest.fn(),
  recordException: jest.fn(),
});

export const createMockMetrics = () => ({
  incrementCounter: jest.fn(),
  recordValue: jest.fn(),
});

export const createMockErrorReporter = () => ({
  reportException: jest.fn(),
});

export const createMockRepository = <T = any>() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
  }),
});

export type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
