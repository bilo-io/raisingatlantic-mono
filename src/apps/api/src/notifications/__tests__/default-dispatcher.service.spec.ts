import { DefaultNotificationDispatcher } from '@core/notifications/dispatcher/default-dispatcher.service';
import { createMockLogger } from '../../common/test/test-utils';

const makeEmail = () => ({
  send: jest.fn().mockResolvedValue({ delivered: true, providerId: 'fake' }),
});
const makeSms = () => ({
  send: jest.fn().mockResolvedValue({ delivered: true, providerId: 'fake' }),
});
const makePush = () => ({
  send: jest.fn().mockResolvedValue({ delivered: true, providerId: 'fake' }),
});

describe('DefaultNotificationDispatcher', () => {
  it('delegates email() to the IEmailService', async () => {
    const email = makeEmail();
    const dispatcher = new DefaultNotificationDispatcher(
      email,
      makeSms(),
      makePush(),
      createMockLogger(),
    );

    const msg = { to: 'a@b.com', subject: 's', text: 't' };
    const result = await dispatcher.email(msg);

    expect(email.send).toHaveBeenCalledWith(msg);
    expect(result).toEqual({ delivered: true, providerId: 'fake' });
  });

  it('delegates sms() to the ISmsService', async () => {
    const sms = makeSms();
    const dispatcher = new DefaultNotificationDispatcher(
      makeEmail(),
      sms,
      makePush(),
      createMockLogger(),
    );

    await dispatcher.sms({ to: '+27 82 000 0000', body: 'hi' });
    expect(sms.send).toHaveBeenCalled();
  });

  it('delegates push() to the IPushNotificationService', async () => {
    const push = makePush();
    const dispatcher = new DefaultNotificationDispatcher(
      makeEmail(),
      makeSms(),
      push,
      createMockLogger(),
    );

    await dispatcher.push({ token: 'tok', title: 't', body: 'b' });
    expect(push.send).toHaveBeenCalled();
  });

  it('notifyUser() is a logged no-op until preferences land', async () => {
    const logger = createMockLogger();
    const dispatcher = new DefaultNotificationDispatcher(
      makeEmail(),
      makeSms(),
      makePush(),
      logger,
    );

    await dispatcher.notifyUser('user-1', 'epi.due', { vaccine: 'BCG' });
    expect(logger.log).toHaveBeenCalledTimes(1);
  });
});
