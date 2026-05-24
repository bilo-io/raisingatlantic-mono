import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

/**
 * Lightweight e2e smoke that boots only AppController + AppService (no DB).
 * Proves the e2e harness wiring works; richer DB-backed e2e is added once
 * a dedicated test Postgres on port 5433 is wired in via Docker (per
 * CLAUDE.md: never mock the DB for integration tests).
 */
describe('App (e2e smoke)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / returns the hello string', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    expect(res.text).toContain('Hello Raising Atlantic');
  });

  it('GET /health returns ok + timestamp', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok' });
    expect(res.body.timestamp).toBeDefined();
    expect(typeof res.body.uptime).toBe('number');
  });

  it('GET /api/dashboard defaults the user id when no cookie is set', async () => {
    const res = await request(app.getHttpServer()).get('/api/dashboard').expect(200);
    expect(res.body).toMatchObject({ userId: 'user-1', isLoadedFromApi: true });
  });
});
