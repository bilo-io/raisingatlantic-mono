import { existsSync } from 'fs';
import { join } from 'path';

const distMain = join(__dirname, '..', 'dist', 'main.js');
const describeBundle = existsSync(distMain) ? describe : describe.skip;

describeBundle('compiled bundle (dist/main.js)', () => {
  beforeAll(() => {
    process.env.VERCEL = '1';
  });

  it('exposes a callable request handler on module.exports', () => {
    jest.isolateModules(() => {
      const mod = require(distMain);
      expect(typeof mod).toBe('function');
      expect(typeof mod.default).toBe('function');
    });
  });
});
