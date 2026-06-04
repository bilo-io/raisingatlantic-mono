import { NoopSmsService } from '@core/notifications/noop/noop-sms.service';
import { createMockLogger } from '../../common/test/test-utils';

describe('NoopSmsService', () => {
  it('logs a redacted phone and returns delivered=false', async () => {
    const logger = createMockLogger();
    const service = new NoopSmsService(logger);

    const result = await service.send({
      to: '+27 82 123 4567',
      body: 'Your appointment is tomorrow at 10am.',
    });

    expect(result).toEqual({ delivered: false, providerId: 'noop' });
    expect(logger.log).toHaveBeenCalledTimes(1);
    const logLine = logger.log.mock.calls[0][0] as string;
    expect(logLine).not.toContain('123');
    expect(logLine).toContain('bodyLen=37');
  });
});
