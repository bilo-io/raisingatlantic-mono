'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, AlertTriangle, CheckCircle2, XCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RedEmergencyStrip } from '@/components/triage/EmergencyContacts';

type TriageLevel = 'red' | 'amber' | 'green';

interface TriageResult {
  level: TriageLevel;
  action: string;
}

type Step =
  | 'intro'
  | 'overrides'
  | 'has-fever'
  | 'age'
  | 'meds-given'
  | 'panado-given'
  | 'nsaid-given'
  | 'perked-up'
  | 'result';

interface Answers {
  overrides: Set<string>;
  hasFever?: boolean;
  ageUnder3Months?: boolean;
  medsGiven?: boolean;
  padadoGiven?: boolean;
  nsaidGiven?: boolean;
  perkedUp?: boolean;
}

const OVERRIDE_ITEMS = [
  { id: 'breathing', label: 'Breathing difficulty' },
  { id: 'seizure', label: 'Seizure' },
  { id: 'vomiting', label: 'Vomiting everything' },
  { id: 'watery-stools', label: 'Large volume watery stools' },
  { id: 'worried', label: 'I am very worried about my child' },
];

const FEVER_THRESHOLDS = [
  { method: 'Oral', threshold: '≥37.8°C (100.0°F)' },
  { method: 'Ear probe', threshold: '≥37.8°C (100.0°F)' },
  { method: 'Underarm', threshold: '≥37.5°C (99.5°F)' },
];

const STEP_ORDER: Step[] = [
  'intro',
  'has-fever',
  'age',
  'meds-given',
  'panado-given',
  'nsaid-given',
  'perked-up',
  'overrides',
  'result',
];

const RESULT_CONFIG: Record<TriageLevel, { bg: string; border: string; text: string; icon: typeof AlertTriangle; label: string }> = {
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-400',
    text: 'text-red-600 dark:text-red-400',
    icon: XCircle,
    label: 'RED — Urgent',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    icon: AlertTriangle,
    label: 'AMBER — Monitor closely',
  },
  green: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: CheckCircle2,
    label: 'GREEN — Home care',
  },
};

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

function prevFromOverrides(answers: Answers): Step {
  if (answers.ageUnder3Months) return 'age';
  if (answers.medsGiven === false) return 'meds-given';
  return 'perked-up';
}

function computeResult(answers: Answers): TriageResult {
  if (answers.overrides.size > 0) {
    return { level: 'red', action: 'See Paed or Go to Emergency Room' };
  }
  if (answers.ageUnder3Months) {
    return { level: 'red', action: 'See Paed or Go to Emergency Room' };
  }
  if (!answers.medsGiven) {
    return { level: 'amber', action: 'Give fever medication, reassess in 30–60 min' };
  }
  if (answers.padadoGiven && !answers.nsaidGiven && !answers.perkedUp) {
    return { level: 'amber', action: 'Consider adding NSAID (Nurofen / Ponstan / Panamor), reassess after 30 min' };
  }
  if (answers.padadoGiven && answers.nsaidGiven && !answers.perkedUp) {
    return { level: 'red', action: 'Go to Emergency Room — not responding to medications' };
  }
  if (answers.perkedUp) {
    return { level: 'green', action: 'Monitor at home and recheck in 4 hours' };
  }
  return { level: 'amber', action: 'Reassess and consider seeking medical advice' };
}

type ActiveStep = Exclude<Step, 'intro' | 'result'>;

function ProgressDots({ steps, current }: { steps: ActiveStep[]; current: Step }) {
  const currentIdx = steps.indexOf(current as ActiveStep);
  return (
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          animate={{
            width: i === currentIdx ? 20 : 6,
            backgroundColor: i < currentIdx ? 'hsl(var(--primary))' : i === currentIdx ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
            opacity: i <= currentIdx ? 1 : 0.4,
          }}
          transition={{ duration: 0.3 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

function YesNoButtons({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <div className="flex gap-3 mt-6">
      <Button onClick={onYes} className="flex-1 bg-primary text-primary-foreground">
        Yes
      </Button>
      <Button onClick={onNo} variant="outline" className="flex-1">
        No
      </Button>
    </div>
  );
}

export function FeverFlow() {
  const [step, setStep] = useState<Step>('intro');
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({ overrides: new Set() });
  const [result, setResult] = useState<TriageResult | null>(null);

  function goTo(next: Step, dir = 1) {
    setDirection(dir);
    setStep(next);
  }

  function resolveResult(finalAnswers: Answers) {
    const r = computeResult(finalAnswers);
    setResult(r);
    setDirection(1);
    setStep('result');
  }

  function reset() {
    setAnswers({ overrides: new Set() });
    setResult(null);
    setDirection(-1);
    setStep('intro');
  }

  function toggleOverride(id: string) {
    setAnswers((prev) => {
      const next = new Set(prev.overrides);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, overrides: next };
    });
  }

  const stepContent: Record<Step, React.ReactNode> = {
    intro: (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold mb-1">Fever Assessment</h2>
          <p className="text-muted-foreground text-sm">
            Answer a few questions to understand what to do.
          </p>
        </div>

        <div className="rounded-xl border bg-amber-500/5 border-amber-400/40 p-4 space-y-3">
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Fever thresholds</p>
          <div className="space-y-2">
            {FEVER_THRESHOLDS.map((t) => (
              <div key={t.method} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.method}</span>
                <span className="font-medium tabular-nums">{t.threshold}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={() => goTo('has-fever')} className="w-full">
          Start <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    ),

    overrides: (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold mb-1">Danger signs</h2>
          <p className="text-muted-foreground text-sm">
            Does your child have any of the following right now?
          </p>
        </div>

        <div className="space-y-2">
          {OVERRIDE_ITEMS.map((item) => {
            const checked = answers.overrides.has(item.id);
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleOverride(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors duration-150',
                  checked
                    ? 'border-red-400 bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'border-border bg-card hover:bg-muted/50'
                )}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors',
                    checked ? 'bg-red-500 border-red-500' : 'border-muted-foreground'
                  )}
                >
                  {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => goTo(prevFromOverrides(answers), -1)}
            className="flex-shrink-0"
          >
            Back
          </Button>
          <Button
            onClick={() => resolveResult(answers)}
            className="flex-1"
          >
            {answers.overrides.size > 0 ? 'Show result' : 'None of these — continue'}
          </Button>
        </div>
      </div>
    ),

    'has-fever': (
      <div>
        <h2 className="text-lg font-semibold mb-2">Does your child have a fever?</h2>
        <p className="text-muted-foreground text-sm">
          Based on the temperature thresholds shown on the previous screen.
        </p>
        <YesNoButtons
          onYes={() => {
            const next = { ...answers, hasFever: true };
            setAnswers(next);
            goTo('age');
          }}
          onNo={() => {
            setDirection(1);
            setResult({ level: 'green', action: 'Temperature is within normal range. Monitor your child and reassess if symptoms develop.' });
            setStep('result');
          }}
        />
      </div>
    ),

    age: (
      <div>
        <h2 className="text-lg font-semibold mb-2">How old is your child?</h2>
        <p className="text-muted-foreground text-sm">
          Age affects how urgently a fever needs to be treated.
        </p>
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => {
              const next = { ...answers, ageUnder3Months: true };
              setAnswers(next);
              goTo('overrides');
            }}
            variant="destructive"
            className="flex-1"
          >
            Under 3 months
          </Button>
          <Button
            onClick={() => {
              const next = { ...answers, ageUnder3Months: false };
              setAnswers(next);
              goTo('meds-given');
            }}
            variant="outline"
            className="flex-1"
          >
            3 months or older
          </Button>
        </div>
      </div>
    ),

    'meds-given': (
      <div>
        <h2 className="text-lg font-semibold mb-2">Have you given any fever medication?</h2>
        <p className="text-muted-foreground text-sm">
          Such as Panado (paracetamol), Nurofen, Ponstan, or Panamor.
        </p>
        <YesNoButtons
          onYes={() => {
            const next = { ...answers, medsGiven: true };
            setAnswers(next);
            goTo('panado-given');
          }}
          onNo={() => {
            const next = { ...answers, medsGiven: false };
            setAnswers(next);
            goTo('overrides');
          }}
        />
      </div>
    ),

    'panado-given': (
      <div>
        <h2 className="text-lg font-semibold mb-2">Did you give Panado (paracetamol)?</h2>
        <p className="text-muted-foreground text-sm">
          Panado / Calpol / paracetamol at the correct weight-based dose.
        </p>
        <YesNoButtons
          onYes={() => {
            const next = { ...answers, padadoGiven: true };
            setAnswers(next);
            goTo('nsaid-given');
          }}
          onNo={() => {
            const next = { ...answers, padadoGiven: false };
            setAnswers(next);
            goTo('nsaid-given');
          }}
        />
      </div>
    ),

    'nsaid-given': (
      <div>
        <h2 className="text-lg font-semibold mb-2">Did you also give an NSAID?</h2>
        <p className="text-muted-foreground text-sm">
          Nurofen (ibuprofen), Ponstan (mefenamic acid), or Panamor (diclofenac).
        </p>
        <YesNoButtons
          onYes={() => {
            const next = { ...answers, nsaidGiven: true };
            setAnswers(next);
            goTo('perked-up');
          }}
          onNo={() => {
            const next = { ...answers, nsaidGiven: false };
            setAnswers(next);
            goTo('perked-up');
          }}
        />
      </div>
    ),

    'perked-up': (
      <div>
        <h2 className="text-lg font-semibold mb-2">Has your child perked up?</h2>
        <p className="text-muted-foreground text-sm">
          After 30–60 minutes — is your child more active, responsive, or settled?
        </p>
        <YesNoButtons
          onYes={() => {
            const next = { ...answers, perkedUp: true };
            setAnswers(next);
            goTo('overrides');
          }}
          onNo={() => {
            const next = { ...answers, perkedUp: false };
            setAnswers(next);
            goTo('overrides');
          }}
        />
      </div>
    ),

    result: null,
  };

  const showProgress = !['intro', 'result'].includes(step);
  const activeSteps = STEP_ORDER.filter((s): s is ActiveStep => s !== 'intro' && s !== 'result');

  return (
    <div className="space-y-2">
      {showProgress && (
        <ProgressDots steps={activeSteps} current={step} />
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          {step === 'result' && result ? (
            <ResultCard result={result} onReset={reset} />
          ) : (
            stepContent[step]
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ result, onReset }: { result: TriageResult; onReset: () => void }) {
  const config = RESULT_CONFIG[result.level];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-5"
    >
      <div className={cn('rounded-xl border p-6 space-y-3 text-center', config.bg, config.border)}>
        <Icon className={cn('h-10 w-10 mx-auto', config.text)} />
        <div>
          <p className={cn('font-bold text-lg', config.text)}>{config.label}</p>
          <p className="text-sm text-foreground/90 mt-2 leading-relaxed">{result.action}</p>
        </div>
      </div>

      {result.level === 'red' && <RedEmergencyStrip />}

      <Button variant="ghost" onClick={onReset} className="w-full">
        <RotateCcw className="h-4 w-4 mr-2" />
        Start over
      </Button>
    </motion.div>
  );
}
