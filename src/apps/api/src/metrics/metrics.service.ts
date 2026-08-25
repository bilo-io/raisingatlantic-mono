import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { bucketVaccine, epiSchedule } from '@raising-atlantic/clinical';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { Child } from '../children/children.model';
import { ResourceStatus } from '../common/enums';

export interface VaccinationsDueSnapshot {
  due: number;
  overdue: number;
}

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Child) private readonly childRepo: Repository<Child>,
    @Inject('IMetricService') private readonly metric: IMetricService,
  ) {}

  /**
   * Point-in-time business gauges are recomputed on a schedule rather than on a
   * request path, so the `business_metrics` dashboard reflects the whole cohort
   * instead of whoever happened to load a screen. EPI bucketing is delegated to
   * `@raising-atlantic/clinical` — age-gate logic is never re-derived here.
   */
  async emitBusinessGauges(
    asOf: Date = new Date(),
  ): Promise<VaccinationsDueSnapshot> {
    const children = await this.childRepo.find({
      where: { status: Not(ResourceStatus.ARCHIVED) },
      relations: ['completedVaccinations'],
    });

    let due = 0;
    let overdue = 0;

    for (const child of children) {
      const completedIds = new Set(
        (child.completedVaccinations ?? []).map((v) => v.vaccineId),
      );
      const dateOfBirth = String(child.dateOfBirth);

      for (const vaccine of epiSchedule) {
        const bucket = bucketVaccine(vaccine, dateOfBirth, completedIds, asOf);
        if (bucket === 'due') due += 1;
        else if (bucket === 'overdue') overdue += 1;
      }
    }

    this.metric.recordValue('ra_vaccinations_due', due, { bucket: 'due' });
    this.metric.recordValue('ra_vaccinations_due', overdue, {
      bucket: 'overdue',
    });

    return { due, overdue };
  }
}
