import { cn } from '@/lib/utils';

const NUMBERS = [
  { label: '10177', sublabel: 'Ambulance', tel: '10177' },
  { label: '10111', sublabel: 'Police', tel: '10111' },
  { label: '112', sublabel: 'Any mobile', tel: '112' },
  { label: '084 124', sublabel: 'ER24', tel: '084124' },
  { label: '082 911', sublabel: 'Netcare 911', tel: '082911' },
];

export function TelLink({ tel, label, className }: { tel: string; label: string; className?: string }) {
  return (
    <a
      href={`tel:${tel}`}
      className={cn('font-medium underline underline-offset-2 hover:opacity-80 transition-opacity', className)}
    >
      {label}
    </a>
  );
}

function NumberButton({ n, variant }: { n: typeof NUMBERS[number]; variant: 'neutral' | 'red' }) {
  return (
    <a
      href={`tel:${n.tel}`}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg px-3 py-2.5 min-w-[72px] min-h-[52px] transition-opacity active:opacity-70',
        variant === 'red'
          ? 'bg-red-500/10 border border-red-400/40 hover:bg-red-500/20'
          : 'bg-muted/60 border border-border hover:bg-muted'
      )}
    >
      <span className={cn('text-sm font-bold tabular-nums', variant === 'red' ? 'text-red-600 dark:text-red-400' : 'text-foreground')}>
        {n.label}
      </span>
      <span className="text-[10px] text-muted-foreground mt-0.5">{n.sublabel}</span>
    </a>
  );
}

export function EmergencyContactsStrip({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border p-4 space-y-2.5', className)}>
      <p className="text-xs font-medium text-foreground/70 text-center">Emergency contacts</p>
      <div className="flex flex-wrap justify-center gap-2">
        {NUMBERS.map((n) => (
          <NumberButton key={n.tel} n={n} variant="neutral" />
        ))}
      </div>
    </div>
  );
}

export function RedEmergencyStrip({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border border-red-400/40 bg-red-500/5 p-4 space-y-2.5', className)}>
      <p className="text-xs font-semibold text-red-600 dark:text-red-400 text-center">Emergency contacts</p>
      <div className="flex flex-wrap justify-center gap-2">
        {NUMBERS.map((n) => (
          <NumberButton key={n.tel} n={n} variant="red" />
        ))}
      </div>
    </div>
  );
}
