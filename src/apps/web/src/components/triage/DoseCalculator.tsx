'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const MEDICATIONS = [
  {
    name: 'Paracetamol',
    brands: 'Panado, Calpol',
    mgPerKg: 15,
    color: 'border-amber-400/50 bg-amber-500/5',
    labelColor: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-400',
    frequency: 'every 4–6 hours',
    maxDaily: 'max 4 doses/day',
  },
  {
    name: 'Nurofen',
    brands: 'Ibuprofen',
    mgPerKg: 10,
    color: 'border-blue-400/50 bg-blue-500/5',
    labelColor: 'text-blue-600 dark:text-blue-400',
    dotColor: 'bg-blue-400',
    frequency: 'every 6–8 hours',
    maxDaily: 'max 3 doses/day',
  },
  {
    name: 'Ponstan',
    brands: 'Mefenamic acid',
    mgPerKg: 6.5,
    color: 'border-purple-400/50 bg-purple-500/5',
    labelColor: 'text-purple-600 dark:text-purple-400',
    dotColor: 'bg-purple-400',
    frequency: 'every 8 hours',
    maxDaily: 'with food',
  },
  {
    name: 'Panamor PR',
    brands: 'Diclofenac suppository',
    mgPerKg: 15,
    color: 'border-rose-400/50 bg-rose-500/5',
    labelColor: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-rose-400',
    frequency: 'once daily',
    maxDaily: 'suppository',
  },
];

function roundToHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

export function DoseCalculator() {
  const [rawWeight, setRawWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  const weightKg = (() => {
    const n = parseFloat(rawWeight);
    if (!rawWeight || isNaN(n) || n <= 0) return null;
    return unit === 'kg' ? n : n / 2.205;
  })();

  const hasWeight = weightKg !== null;

  return (
    <div className="space-y-6">
      {/* Weight input */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Child's weight</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            max={unit === 'kg' ? 100 : 220}
            step={0.1}
            placeholder={unit === 'kg' ? 'e.g. 15' : 'e.g. 33'}
            value={rawWeight}
            onChange={(e) => setRawWeight(e.target.value)}
            className="max-w-[160px] text-base"
          />
          <div className="flex rounded-lg border overflow-hidden">
            {(['kg', 'lbs'] as const).map((u) => (
              <button
                key={u}
                onClick={() => {
                  if (rawWeight && !isNaN(parseFloat(rawWeight))) {
                    const n = parseFloat(rawWeight);
                    if (u === 'lbs' && unit === 'kg') {
                      setRawWeight((n * 2.205).toFixed(1));
                    } else if (u === 'kg' && unit === 'lbs') {
                      setRawWeight((n / 2.205).toFixed(1));
                    }
                  }
                  setUnit(u);
                }}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  unit === u
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                )}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        {hasWeight && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground"
          >
            {weightKg!.toFixed(2)} kg
          </motion.p>
        )}
      </div>

      {/* Dose cards */}
      <AnimatePresence mode="wait">
        {!hasWeight ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm"
          >
            Enter your child's weight above to see recommended doses.
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {MEDICATIONS.map((med, i) => {
              const dose = roundToHalf(weightKg! * med.mgPerKg);
              return (
                <motion.div
                  key={med.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3, ease: 'easeOut' }}
                  className={cn('rounded-xl border p-4 space-y-2', med.color)}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full flex-shrink-0', med.dotColor)} />
                    <span className={cn('font-semibold text-sm', med.labelColor)}>{med.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{med.brands}</p>
                  <div className="pt-1">
                    <span className="text-2xl font-bold tabular-nums">{dose}</span>
                    <span className="text-sm text-muted-foreground ml-1">mg</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {med.frequency} · {med.maxDaily}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground border-t pt-4">
        Doses are weight-based estimates (mg/kg). Always confirm with the medication packaging or your
        pharmacist. Do not exceed recommended daily limits. Avoid ibuprofen-class drugs in children
        under 6 months or with certain conditions — consult your doctor.
      </p>
    </div>
  );
}
