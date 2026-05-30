import { validate } from 'class-validator';
import { CreateReportDto } from '../../reports/dto/create-report.dto';
import { ReportType } from '../../reports/reports.model';

function nestedObject(depth: number): Record<string, unknown> {
  let current: Record<string, unknown> = { leaf: true };
  for (let i = 0; i < depth; i += 1) {
    current = { child: current };
  }
  return current;
}

describe('CreateReportDto.content depth cap', () => {
  const base = {
    childId: 'child-1',
    type: ReportType.CLINICAL_SUMMARY,
  };

  it('accepts shallow content within the depth cap', async () => {
    const dto = Object.assign(new CreateReportDto(), {
      ...base,
      content: { a: { b: { c: 'ok' } } },
    });
    const errors = await validate(dto);
    expect(errors).toEqual([]);
  });

  it('rejects content nested past the cap', async () => {
    const dto = Object.assign(new CreateReportDto(), {
      ...base,
      content: nestedObject(10),
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('MaxObjectDepth');
  });

  it('rejects content whose total key count exceeds the budget', async () => {
    const huge: Record<string, unknown> = {};
    for (let i = 0; i < 500; i += 1) huge[`k${i}`] = i;
    const dto = Object.assign(new CreateReportDto(), {
      ...base,
      content: huge,
    });
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty('MaxObjectDepth');
  });
});
