import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateFeatureRequestDto } from './create-feature-request.dto';

async function errorsFor(payload: Record<string, unknown>) {
  const dto = plainToInstance(CreateFeatureRequestDto, payload);
  const errors = await validate(dto);
  return errors.flatMap((e) => Object.keys(e.constraints ?? {}));
}

describe('CreateFeatureRequestDto', () => {
  it('accepts a valid anonymous request', async () => {
    expect(
      await errorsFor({ title: 'Dark mode', description: 'Nice at night' }),
    ).toHaveLength(0);
  });

  it('rejects an empty title', async () => {
    const props = await errorsFor({ title: '', description: 'x' });
    expect(props).toContain('isNotEmpty');
  });

  it('rejects a title over 80 chars', async () => {
    const props = await errorsFor({
      title: 'a'.repeat(81),
      description: 'ok',
    });
    expect(props).toContain('maxLength');
  });

  it('rejects a description over 200 chars', async () => {
    const props = await errorsFor({
      title: 'ok',
      description: 'a'.repeat(201),
    });
    expect(props).toContain('maxLength');
  });

  it('rejects an invalid email', async () => {
    const props = await errorsFor({
      title: 'ok',
      description: 'ok',
      email: 'not-an-email',
      consent: true,
    });
    expect(props).toContain('isEmail');
  });

  it('requires consent === true when an email is supplied', async () => {
    const props = await errorsFor({
      title: 'ok',
      description: 'ok',
      email: 'jane@example.com',
      consent: false,
    });
    expect(props).toContain('equals');
  });

  it('does not require consent when no email is supplied', async () => {
    expect(await errorsFor({ title: 'ok', description: 'ok' })).toHaveLength(0);
  });
});
