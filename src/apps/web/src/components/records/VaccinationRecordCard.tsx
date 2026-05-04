"use client";

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, ChevronDown, Download, Loader2, Bell, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';
import type { ChildDetail } from '@/types/models';
import type { Vaccination, VaccinationTrack } from '@/data/vaccinations';
import { VaccinationRecordPdfTemplate, type ClinicianContext } from './VaccinationRecordPdfTemplate';
import { exportVaccinationRecordPdf } from '@/lib/pdf/vaccination-record';

type Props = {
  child: ChildDetail;
  vaccinationsMaster: Vaccination[];
  clinician?: ClinicianContext;
};

type FilterMode = 'all' | 'EPI' | 'PRIVATE';
type RowState = 'given' | 'parent' | 'due' | 'upcoming';

function recommendedAgeToMonths(label: string): number {
  if (/birth/i.test(label)) return 0;
  const m = label.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function ageInMonths(dob: string | Date): number {
  const birth = new Date(dob);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

function ageLabel(dob: string | Date): string {
  const months = ageInMonths(dob);
  if (months < 24) return `${months} month${months === 1 ? '' : 's'}`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'}`;
}

function bornLabel(dob: string | Date): string {
  return `Born ${format(new Date(dob), 'MMM yyyy')}`;
}

function rowStateFor(child: ChildDetail, vaccine: Vaccination): { state: RowState; targetMs: number } {
  const completed = child.completedVaccinations.find(cv => cv.vaccineId === vaccine.id);
  const targetMs = new Date(child.dateOfBirth).getTime() + recommendedAgeToMonths(vaccine.recommendedAge) * 30.44 * 86400 * 1000;
  if (completed) return { state: completed.source === 'PARENT' ? 'parent' : 'given', targetMs };
  return { state: targetMs < Date.now() ? 'due' : 'upcoming', targetMs };
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function StatusCircle({ state, size = 'md' }: { state: RowState; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const inner = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  if (state === 'given') {
    return (
      <span className={cn('inline-flex items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500', dim)}>
        <Check className={cn('text-emerald-500', inner)} strokeWidth={3} />
      </span>
    );
  }
  if (state === 'parent') {
    return (
      <span className={cn('inline-flex items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-500', dim)}>
        <Check className={cn('text-amber-500', inner)} strokeWidth={3} />
      </span>
    );
  }
  if (state === 'due') {
    return (
      <span className={cn('inline-flex items-center justify-center rounded-full bg-sky-500/20 ring-1 ring-sky-500', dim)} />
    );
  }
  return <span className={cn('inline-flex rounded-full ring-1 ring-muted-foreground/40', dim)} />;
}

function GroupCircle({ given, total, hasDue }: { given: number; total: number; hasDue: boolean }) {
  if (given === total) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500">
        <Check className="h-3 w-3 text-emerald-500" strokeWidth={3} />
      </span>
    );
  }
  if (given > 0 && given < total) {
    return (
      <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-emerald-500/60">
        <span className="absolute inset-0 rounded-full bg-emerald-500/20" style={{ clipPath: `inset(0 ${100 - (given / total) * 100}% 0 0)` }} />
        <Check className="relative h-3 w-3 text-emerald-500/80" strokeWidth={3} />
      </span>
    );
  }
  if (hasDue) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 ring-1 ring-sky-500">
        <span className="h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-sky-500 ml-0.5" />
      </span>
    );
  }
  return <span className="inline-flex h-5 w-5 rounded-full ring-1 ring-muted-foreground/40" />;
}

function TrackChip({ vaccine }: { vaccine: Vaccination }) {
  const isAnnual = /annual/i.test(vaccine.recommendedAge);
  if (isAnnual) {
    return <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/15 border-transparent">Annual</Badge>;
  }
  if (vaccine.track === 'PRIVATE') {
    return <Badge className="bg-violet-500/15 text-violet-400 hover:bg-violet-500/15 border-transparent">Private</Badge>;
  }
  return <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15 border-transparent">EPI</Badge>;
}

export function VaccinationRecordCard({ child, vaccinationsMaster, clinician }: Props) {
  const printRef = React.useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = React.useState(false);
  const [filter, setFilter] = React.useState<FilterMode>('all');
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const { addToast } = useToast();

  const handleExport = async () => {
    if (!printRef.current) return;
    try {
      setExporting(true);
      const safeName = child.name.replace(/\s+/g, '_');
      await exportVaccinationRecordPdf({
        templateRoot: printRef.current,
        fileName: `VaccinationRecord_${safeName}.pdf`,
      });
      addToast({
        title: 'PDF exported',
        description: `${child.name}'s vaccination record was downloaded.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to export vaccination PDF', err);
      addToast({
        title: 'Export failed',
        description: 'We could not generate the PDF. Please try again.',
        type: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  const orderedAges = React.useMemo(() => {
    return vaccinationsMaster
      .map(v => v.recommendedAge)
      .filter((age, i, arr) => arr.indexOf(age) === i);
  }, [vaccinationsMaster]);

  const groups = React.useMemo(() => {
    return orderedAges.map(age => {
      const vaccines = vaccinationsMaster.filter(v => v.recommendedAge === age);
      const visible = filter === 'all' ? vaccines : vaccines.filter(v => (v.track ?? 'EPI') === filter);
      const rows = visible.map(v => ({ vaccine: v, ...rowStateFor(child, v) }));
      const givenCount = vaccines.filter(v => child.completedVaccinations.some(cv => cv.vaccineId === v.id)).length;
      const hasDue = rows.some(r => r.state === 'due');
      return { age, vaccines, visibleRows: rows, givenCount, total: vaccines.length, hasDue };
    });
  }, [orderedAges, vaccinationsMaster, filter, child]);

  const nextDue = React.useMemo(() => {
    for (const g of groups) {
      const due = g.visibleRows.filter(r => r.state === 'due');
      if (due.length > 0) {
        return { age: g.age, vaccines: due.map(d => d.vaccine), targetMs: due[0].targetMs, label: 'Due soon' };
      }
    }
    for (const g of groups) {
      const upcoming = g.visibleRows.filter(r => r.state === 'upcoming');
      if (upcoming.length > 0) {
        return { age: g.age, vaccines: upcoming.map(u => u.vaccine), targetMs: upcoming[0].targetMs, label: 'Upcoming' };
      }
    }
    return null;
  }, [groups]);

  const showFluReminder = ageInMonths(child.dateOfBirth) < 12;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback name={child.name}>{initials(child.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-base font-semibold leading-tight">{child.name}</div>
            <div className="text-xs text-muted-foreground">{ageLabel(child.dateOfBirth)} · {bornLabel(child.dateOfBirth)}</div>
          </div>
        </div>
        <Button onClick={handleExport} disabled={exporting} size="sm" variant="outline">
          {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {exporting ? 'Exporting…' : 'Export PDF'}
        </Button>
      </div>

      <CardContent className="p-4 space-y-4">
        {nextDue && (
          <div className="rounded-xl border bg-muted/40 p-4 flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Next due</div>
              <div className="font-semibold text-sm mt-1">{nextDue.vaccines.map(v => v.name).join(' · ')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {nextDue.age} · ~{format(new Date(nextDue.targetMs), 'MMM yyyy')}
              </div>
            </div>
            <Badge className={cn('shrink-0', nextDue.label === 'Due soon' ? 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15' : 'bg-sky-500/15 text-sky-500 hover:bg-sky-500/15', 'border-transparent')}>
              <Clock className="mr-1 h-3 w-3" />
              {nextDue.label}
            </Badge>
          </div>
        )}

        {showFluReminder && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2 text-xs text-amber-500/90">
            <Bell className="h-4 w-4 mt-0.5 shrink-0" />
            <div>Annual flu vaccine due — Beyfortus reminder: give each RSV season for infants under 12 months.</div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {(['all', 'EPI', 'PRIVATE'] as FilterMode[]).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium border transition-colors',
                filter === mode ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-muted hover:bg-muted/40'
              )}
            >
              {mode === 'all' ? 'All' : mode === 'EPI' ? 'EPI' : 'Private'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {groups.map(group => {
            if (group.visibleRows.length === 0) return null;
            const isCollapsed = collapsed[group.age];
            return (
              <div key={group.age}>
                <button
                  type="button"
                  onClick={() => setCollapsed(prev => ({ ...prev, [group.age]: !prev[group.age] }))}
                  className="flex items-center gap-2 py-1.5 w-full text-left"
                >
                  <GroupCircle given={group.givenCount} total={group.total} hasDue={group.hasDue} />
                  <span className="font-semibold text-sm">{group.age}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{group.givenCount}/{group.total}</span>
                  <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', isCollapsed && '-rotate-90')} />
                </button>

                <div
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-200 ease-out',
                    isCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="ml-7 space-y-1.5 pt-1.5 pb-0.5">
                      {group.visibleRows.map(({ vaccine, state }) => (
                        <div
                          key={vaccine.id}
                          className="flex items-center gap-3 rounded-full border bg-muted/30 px-4 py-2"
                        >
                          <StatusCircle state={state} size="sm" />
                          <span className="text-sm flex-1 truncate">{vaccine.name}</span>
                          <TrackChip vaccine={vaccine} />
                          <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div ref={printRef} style={{ width: 794, background: '#fff' }}>
          <VaccinationRecordPdfTemplate
            child={child}
            vaccinationsMaster={vaccinationsMaster}
            clinician={clinician}
          />
        </div>
      </div>
    </Card>
  );
}
