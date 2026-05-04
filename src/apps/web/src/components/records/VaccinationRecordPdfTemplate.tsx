"use client";

import * as React from 'react';
import type { ChildDetail } from '@/types/models';
import type { Vaccination } from '@/data/vaccinations';
import { formatDateStandard } from '@/utils/date';

export type VaccinationRowStatus = 'verified' | 'parent' | 'due' | 'upcoming';

export type ClinicianContext = {
  name: string;
  practice?: string;
  hpcsa?: string;
};

type CompletedRecord = ChildDetail['completedVaccinations'][number];

type Props = {
  child: ChildDetail;
  vaccinationsMaster: Vaccination[];
  clinician?: ClinicianContext;
  exportedAt?: Date;
};

const COLORS = {
  brand: '#0c3a73',
  brandSoft: '#dde7f4',
  groupBand: '#f3f6fb',
  rowBorder: '#eef0f4',
  text: '#1a2330',
  muted: '#6b7280',
  verified: '#1f8a4a',
  verifiedSoft: '#dcf2e3',
  parent: '#c2580c',
  parentSoft: '#fde7d2',
  due: '#374151',
  dueSoft: '#e5e7eb',
  upcoming: '#9ca3af',
  upcomingSoft: '#f3f4f6',
  epi: '#1f8a4a',
  epiSoft: '#dcf2e3',
  privateChip: '#5b3fa1',
  privateChipSoft: '#ece4f7',
};

function recommendedAgeToMonths(label: string): number {
  if (/birth/i.test(label)) return 0;
  const m = label.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function computeAgeMonths(dob: string | Date): number {
  const birth = new Date(dob);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

function ageLabel(dob: string | Date): string {
  const months = computeAgeMonths(dob);
  if (months < 24) return `${months} month${months === 1 ? '' : 's'}`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'}`;
}

function rowStatus(child: ChildDetail, vaccine: Vaccination, completed?: CompletedRecord): VaccinationRowStatus {
  if (completed) return completed.source === 'PARENT' ? 'parent' : 'verified';
  const targetMs = new Date(child.dateOfBirth).getTime() + recommendedAgeToMonths(vaccine.recommendedAge) * 30.44 * 86400 * 1000;
  return targetMs < Date.now() ? 'due' : 'upcoming';
}

function recordIdFor(child: ChildDetail): string {
  const year = new Date(child.dateOfBirth).getFullYear();
  const tail = String(child.id).replace(/[^a-z0-9]/gi, '').slice(-5).toUpperCase().padStart(5, '0');
  return `RA-${year}-${tail}`;
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function StatusDot({ status }: { status: VaccinationRowStatus }) {
  const map: Record<VaccinationRowStatus, { bg: string; ring: string; mark: string }> = {
    verified: { bg: COLORS.verifiedSoft, ring: COLORS.verified, mark: '✓' },
    parent: { bg: COLORS.parentSoft, ring: COLORS.parent, mark: '✓' },
    due: { bg: COLORS.dueSoft, ring: COLORS.due, mark: '!' },
    upcoming: { bg: COLORS.upcomingSoft, ring: COLORS.upcoming, mark: '' },
  };
  const s = map[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: 999,
        background: s.bg,
        color: s.ring,
        border: `1.5px solid ${s.ring}`,
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {s.mark}
    </span>
  );
}

function Chip({ label, fg, bg }: { label: string; fg: string; bg: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: 0.2,
      }}
    >
      {label}
    </span>
  );
}

export const PDF_TEMPLATE_WIDTH = 794;

export function VaccinationRecordPdfTemplate({ child, vaccinationsMaster, clinician, exportedAt }: Props) {
  const exported = exportedAt ?? new Date();
  const exportedLabel = formatDateStandard(exported.toISOString());
  const recordId = recordIdFor(child);
  const dob = formatDateStandard(typeof child.dateOfBirth === 'string' ? child.dateOfBirth : child.dateOfBirth.toISOString());
  const orderedAges = vaccinationsMaster
    .map(v => v.recommendedAge)
    .filter((age, i, arr) => arr.indexOf(age) === i);
  const groups = orderedAges.map(age => ({
    age,
    vaccines: vaccinationsMaster.filter(v => v.recommendedAge === age),
  }));

  const cell: React.CSSProperties = {
    padding: '8px 10px',
    fontSize: 11,
    color: COLORS.text,
    borderBottom: `1px solid ${COLORS.rowBorder}`,
    verticalAlign: 'middle',
  };
  const headerCell: React.CSSProperties = {
    ...cell,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.text,
    textAlign: 'left',
    background: '#fff',
    borderBottom: `1.5px solid ${COLORS.rowBorder}`,
  };

  return (
    <div
      style={{
        width: PDF_TEMPLATE_WIDTH,
        background: '#fff',
        color: COLORS.text,
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 12,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ background: COLORS.brand, color: '#fff', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Raising Atlantic</div>
          <div style={{ fontSize: 11, color: '#cfd9ea', marginTop: 2 }}>Child Health Platform</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '8px 14px', textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>VACCINATION RECORD</div>
          <div style={{ fontSize: 10, color: '#cfd9ea', marginTop: 2 }}>Exported {exportedLabel}</div>
        </div>
      </div>

      <div style={{ padding: '24px 32px 0 32px' }}>
        <div style={{ background: '#f7f9fc', border: `1px solid ${COLORS.rowBorder}`, borderRadius: 8, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: COLORS.brandSoft, color: COLORS.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
              {initials(child.name)}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{child.name}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                DOB: {dob} &nbsp;|&nbsp; Age: {ageLabel(child.dateOfBirth)}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Record ID: {recordId}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: COLORS.muted, lineHeight: 1.5 }}>
            <div style={{ color: COLORS.text, fontWeight: 600 }}>{clinician?.name ?? '—'}</div>
            <div>{clinician?.practice ?? '—'}</div>
            <div>{clinician?.hpcsa ? `HPCSA: ${clinician.hpcsa}` : ''}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, fontSize: 10, color: COLORS.muted, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600 }}>STATUS KEY:</span>
          <Chip label="Verified" fg={COLORS.verified} bg={COLORS.verifiedSoft} />
          <Chip label="Parent report" fg={COLORS.parent} bg={COLORS.parentSoft} />
          <Chip label="Due" fg={COLORS.due} bg={COLORS.dueSoft} />
          <Chip label="Upcoming" fg={COLORS.upcoming} bg={COLORS.upcomingSoft} />
          <Chip label="EPI" fg={COLORS.epi} bg={COLORS.epiSoft} />
          <Chip label="Private" fg={COLORS.privateChip} bg={COLORS.privateChipSoft} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 18 }}>
          <thead>
            <tr>
              <th style={{ ...headerCell, width: 28 }}></th>
              <th style={headerCell}>Vaccine</th>
              <th style={{ ...headerCell, width: 70 }}>Track</th>
              <th style={{ ...headerCell, width: 90 }}>Date given</th>
              <th style={{ ...headerCell, width: 90 }}>Batch no.</th>
              <th style={{ ...headerCell, width: 75 }}>Expiry</th>
              <th style={{ ...headerCell, width: 110 }}>Manufacturer</th>
              <th style={{ ...headerCell, width: 130 }}>Administered by</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => {
              const givenCount = group.vaccines.filter(v =>
                child.completedVaccinations.some(cv => cv.vaccineId === v.id)
              ).length;
              return (
                <React.Fragment key={group.age}>
                  <tr>
                    <td colSpan={7} style={{ ...cell, background: COLORS.groupBand, fontWeight: 700, fontSize: 11 }}>{group.age}</td>
                    <td style={{ ...cell, background: COLORS.groupBand, textAlign: 'right', fontSize: 10, color: COLORS.muted, fontWeight: 600 }}>
                      {givenCount}/{group.vaccines.length} given
                    </td>
                  </tr>
                  {group.vaccines.map(vaccine => {
                    const completed = child.completedVaccinations.find(cv => cv.vaccineId === vaccine.id);
                    const status = rowStatus(child, vaccine, completed);
                    const trackChip = vaccine.track === 'PRIVATE'
                      ? <Chip label="Private" fg={COLORS.privateChip} bg={COLORS.privateChipSoft} />
                      : <Chip label="EPI" fg={COLORS.epi} bg={COLORS.epiSoft} />;
                    const adminBy = completed?.administeredByName
                      ? `${completed.administeredByName}${completed.clinicName ? ' · ' + completed.clinicName : ''}`
                      : '—';
                    return (
                      <tr key={vaccine.id}>
                        <td style={cell}><StatusDot status={status} /></td>
                        <td style={{ ...cell, fontWeight: 500 }}>{vaccine.name}</td>
                        <td style={cell}>{trackChip}</td>
                        <td style={cell}>{completed ? formatDateStandard(completed.dateAdministered) : '—'}</td>
                        <td style={cell}>{completed?.batchNumber ?? '—'}</td>
                        <td style={cell}>{completed?.expiryDate ? formatDateStandard(completed.expiryDate) : '—'}</td>
                        <td style={cell}>{completed?.manufacturer ?? '—'}</td>
                        <td style={cell}>{adminBy}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        <div style={{ marginTop: 22, padding: '14px 16px', borderTop: `1px solid ${COLORS.rowBorder}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Clinical notes</div>
          <div style={{ fontSize: 10, color: COLORS.muted, lineHeight: 1.6 }}>
            <div>Influenza: Annual vaccine from 6 months. Two doses 4 weeks apart if receiving for the first time. Subsequent years: single dose. Reformulated annually — prior season batch is not valid.</div>
            <div style={{ marginTop: 6 }}>Parent-reported entries are flagged and have not been independently verified within the Raising Atlantic platform.</div>
          </div>
        </div>

        <div style={{ marginTop: 14, padding: '14px 16px', borderTop: `1px solid ${COLORS.rowBorder}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Clinical verification</div>
          <div style={{ fontSize: 10, color: COLORS.muted, lineHeight: 1.6 }}>
            This record was exported by {clinician?.name ?? '—'}{clinician?.hpcsa ? ` (${clinician.hpcsa})` : ''}{clinician?.practice ? `, ${clinician.practice}` : ''}, on {exportedLabel}.
            <div style={{ marginTop: 4 }}>Verified entries reflect clinical administration confirmed within the Raising Atlantic platform.</div>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 24, fontSize: 10, color: COLORS.muted }}>
            <div style={{ flex: 1, borderTop: `1px solid ${COLORS.text}`, paddingTop: 4 }}>Signature</div>
            <div style={{ flex: 1, borderTop: `1px solid ${COLORS.text}`, paddingTop: 4 }}>Date</div>
          </div>
        </div>

        <div style={{ marginTop: 24, paddingTop: 12, borderTop: `1px solid ${COLORS.rowBorder}`, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: COLORS.muted }}>
          <div>Raising Atlantic · raisingatlantic.com · Confidential medical record · {exportedLabel}</div>
          <div>Record ID: {recordId}</div>
        </div>
      </div>
    </div>
  );
}
