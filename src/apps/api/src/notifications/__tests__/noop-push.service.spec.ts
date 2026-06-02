import { NoopPushService } from '@core/notifications/noop/noop-push.service';
import { createMockLogger } from '../../common/test/test-utils';

describe('NoopPushService', () => {
  it('logs a redacted token and returns delivered=false', async () => {
    const logger = createMockLogger();
    const service = new NoopPushService(logger as any);

    const result = await service.send({
      token: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxx]',
      title: 'Vaccination reminder',
      body: 'BCG is due this week',
    });

    expect(result).toEqual({ delivered: false, providerId: 'noop' });
    expect(logger.log).toHaveBeenCalledTimes(1);
    const logLine = logger.log.mock.calls[0][0] as string;
    expect(logLine).not.toContain('ExponentPushToken[xxxxxxxxxxxxxxxxxxxx]');
    expect(logLine).toContain('Vaccination reminder');
  });
});
