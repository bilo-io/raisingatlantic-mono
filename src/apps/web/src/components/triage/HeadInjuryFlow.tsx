'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EmergencyContactsStrip, RedEmergencyStrip } from '@/components/triage/EmergencyContacts';

type OutcomeLevel = 'emergency' | 'emergency-dept' | 'see-paed' | 'home-care';

interface Outcome {
  level: OutcomeLevel;
  guidance: string;
  detail: string;
}

interface Question {
  id: number;
  text: string;
  yesOutcome?: Outcome;
  yesContinue?: false;
  noText: string;
}

const OUTCOMES: Record<OutcomeLevel, { label: string; icon: typeof Phone; bg: string; border: string; text: string; badge: string }> = {
  emergency: {
    label: 'Emergency — Call now',
    icon: Phone,
    bg: 'bg-red-500/10',
    border: 'border-red-400',
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-500',
  },
  'emergency-dept': {
    label: 'Go to Emergency Department',
    icon: AlertTriangle,
    bg: 'bg-orange-500/10',
    border: 'border-orange-400',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-500',
  },
  'see-paed': {
    label: 'See a Paediatrician Today',
    icon: Stethoscope,
    bg: 'bg-blue-500/10',
    border: 'border-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-400',
  },
  'home-care': {
    label: 'Home Care — Monitor',
    icon: ShieldCheck,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500',
  },
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Is your child unconscious, unresponsive, or not breathing normally?',
    yesOutcome: {
      level: 'emergency',
      guidance: 'Call 10177 (Ambulance) or 112 (mobile)',
      detail: 'Do not move the child unless they are in immediate danger. Stay on the line with the operator.',
    },
    noText: 'Good — continue.',
  },
  {
    id: 2,
    text: 'Is your child having a seizure (fit) or has had one since the injury?',
    yesOutcome: {
      level: 'emergency',
      guidance: 'Call 10177 (Ambulance) or 112 (mobile)',
      detail: 'Lay the child on their side (recovery position). Time the seizure. Don\'t put anything in their mouth.',
    },
    noText: 'Continue.',
  },
  {
    id: 3,
    text: 'Is there blood or clear fluid coming from the ears or nose (not from a cut)?',
    yesOutcome: {
      level: 'emergency',
      guidance: 'Call 10177 (Ambulance) or 112 (mobile)',
      detail: 'This may indicate a skull base fracture. Do not plug the ear or nose.',
    },
    noText: 'Continue.',
  },
  {
    id: 4,
    text: 'Does your child have a very large, soft, boggy lump on the head (not a firm, regular bump)?',
    yesOutcome: {
      level: 'emergency-dept',
      guidance: 'Go to Emergency Department',
      detail: 'Especially concerning in infants under 12 months. A soft swelling on the scalp may indicate bleeding under the skull.',
    },
    noText: 'A firm egg-shaped bump is very common and usually harmless. Continue.',
  },
  {
    id: 5,
    text: 'Did your child lose consciousness — even briefly (went limp or eyes rolled)?',
    yesOutcome: {
      level: 'emergency-dept',
      guidance: 'Go to Emergency Department',
      detail: 'Even a few seconds of unconsciousness requires medical assessment for concussion or more serious injury.',
    },
    noText: 'Continue.',
  },
  {
    id: 6,
    text: 'Is your child very difficult to wake, extremely drowsy, or acting very confused / "not themselves"?',
    yesOutcome: {
      level: 'emergency-dept',
      guidance: 'Go to Emergency Department',
      detail: 'Some sleepiness right after a fall is normal, but your child should be rousable and recognise you.',
    },
    noText: 'Continue.',
  },
  {
    id: 7,
    text: 'Has your child vomited 3 or more times since the injury?',
    yesOutcome: {
      level: 'emergency-dept',
      guidance: 'Go to Emergency Department',
      detail: 'Vomiting once or twice is common after a head knock. Repeated vomiting (≥3 times) needs urgent review.',
    },
    noText: 'Continue.',
  },
  {
    id: 8,
    text: 'Does your child have a severe headache that is not improving, or a stiff neck?',
    yesOutcome: {
      level: 'emergency-dept',
      guidance: 'Go to Emergency Department',
      detail: 'Worsening or persistent severe headache after head injury needs urgent review.',
    },
    noText: 'Continue.',
  },
  {
    id: 9,
    text: 'Is your child under 12 months old AND had a fall of any height onto a hard surface?',
    yesOutcome: {
      level: 'see-paed',
      guidance: 'See a Paediatrician Today',
      detail: 'Infants\' skulls are more vulnerable. Even if they seem fine, a same-day review by a doctor is recommended.',
    },
    noText: 'Continue.',
  },
  {
    id: 10,
    text: 'Was the fall from a height greater than your child\'s own height, or onto a very hard surface (concrete, tiles)?',
    yesOutcome: {
      level: 'see-paed',
      guidance: 'See a Paediatrician Today',
      detail: 'High-energy impacts warrant same-day review even without obvious symptoms.',
    },
    noText: 'Continue.',
  },
  {
    id: 11,
    text: 'Does your child have a cut or wound on the head that won\'t stop bleeding after 10 minutes of firm pressure, or is gaping open?',
    yesOutcome: {
      level: 'see-paed',
      guidance: 'See a Paediatrician / Emergency Dept',
      detail: 'The wound may need cleaning, glue, steri-strips, or stitches. Apply firm pressure with a clean cloth while travelling.',
    },
    noText: 'Continue.',
  },
  {
    id: 12,
    text: 'Is your child generally back to normal — crying briefly then settling, playing, feeding, making eye contact?',
    yesOutcome: {
      level: 'home-care',
      guidance: 'Home Care & Monitor',
      detail: 'This is reassuring. Check on your child every few hours for the next 24 hours.',
    },
    noText: 'If you\'re unsure or something doesn\'t feel right, trust your instincts.',
  },
];

const WARNING_SIGNS = [
  'Cannot be woken or extremely drowsy',
  'Repeated vomiting (≥3 times)',
  'Seizure or jerking movements',
  'Slurred speech or confusion',
  'Unsteady walking or loss of balance',
  'One pupil larger than the other',
  'Headache that keeps getting worse',
  'Unusual behaviour or won\'t stop crying',
  'Weakness in arms or legs',
  'Sleeping much more than normal',
];

const HOME_CARE_ADVICE = [
  {
    title: 'Ice pack for the bump',
    body: 'Wrap ice or a frozen pack in a cloth. Apply for 10–15 minutes. Never put ice directly on skin.',
  },
  {
    title: 'Pain relief',
    body: 'Paracetamol (e.g. Panadol Children\'s) at the correct dose. Avoid ibuprofen in the first few hours as it may mask symptoms. Avoid aspirin.',
  },
  {
    title: 'Rest for the remainder of the day',
    body: 'Quiet play is fine. Avoid vigorous activity, contact sports, or screen time for at least 24 hours.',
  },
  {
    title: 'Sleep — it is OK to let them sleep',
    body: 'You do not need to wake them every hour. Do check that they are rousable and normal colour.',
  },
  {
    title: 'Monitor for 24–48 hours',
    body: 'Check frequently and review the warning signs above. If anything worries you, see a paediatrician.',
  },
  {
    title: 'School and sport',
    body: 'Keep them home from sport until symptom-free. Return to school gradually.',
  },
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
};

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="h-1 bg-muted rounded-full overflow-hidden mb-6">
      <motion.div
        className="h-full bg-primary rounded-full"
        animate={{ width: `${((current) / total) * 100}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

function HomeCareResult({ onReset }: { onReset: () => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const config = OUTCOMES['home-care'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-5"
    >
      <div className={cn('rounded-xl border p-5 text-center space-y-2', config.bg, config.border)}>
        <Icon className={cn('h-9 w-9 mx-auto', config.text)} />
        <p className={cn('font-bold text-base', config.text)}>{config.label}</p>
        <p className="text-sm text-muted-foreground">
          This is reassuring. Check on your child every few hours for the next 24 hours.
        </p>
      </div>

      {/* Warning signs */}
      <div className="rounded-xl border border-amber-400/40 bg-amber-500/5 p-4 space-y-3">
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4" />
          Return to ED immediately if any develop in the next 48 hours
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {WARNING_SIGNS.map((sign) => (
            <div key={sign} className="flex items-start gap-2 text-xs text-foreground/80">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              {sign}
            </div>
          ))}
        </div>
      </div>

      {/* Home care accordion */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          Home Care Advice
        </p>
        {HOME_CARE_ADVICE.map((item, i) => (
          <motion.div key={item.title} layout className="rounded-lg border overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left hover:bg-muted/50 transition-colors"
            >
              {item.title}
              <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-3 text-sm text-muted-foreground">{item.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <EmergencyContactsStrip />

      <Button variant="ghost" onClick={onReset} className="w-full">
        <RotateCcw className="h-4 w-4 mr-2" />
        Start over
      </Button>
    </motion.div>
  );
}

function OutcomeCard({ outcome, onReset }: { outcome: Outcome; onReset: () => void }) {
  const config = OUTCOMES[outcome.level];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div className={cn('rounded-xl border p-6 space-y-3 text-center', config.bg, config.border)}>
        <Icon className={cn('h-10 w-10 mx-auto', config.text)} />
        <div>
          <p className={cn('font-bold text-lg', config.text)}>{outcome.guidance}</p>
          <p className="text-sm text-foreground/90 mt-2 leading-relaxed">{outcome.detail}</p>
        </div>
      </div>

      {(outcome.level === 'emergency' || outcome.level === 'emergency-dept') && (
        <RedEmergencyStrip />
      )}

      <Button variant="ghost" onClick={onReset} className="w-full">
        <RotateCcw className="h-4 w-4 mr-2" />
        Start over
      </Button>
    </motion.div>
  );
}

export function HeadInjuryFlow() {
  const [phase, setPhase] = useState<'intro' | 'questions' | 'outcome'>('intro');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [isHomeCare, setIsHomeCare] = useState(false);

  const currentQuestion = QUESTIONS[questionIdx];

  function startFlow() {
    setDirection(1);
    setPhase('questions');
  }

  function handleYes() {
    const q = QUESTIONS[questionIdx];
    if (q.yesOutcome) {
      if (q.yesOutcome.level === 'home-care') {
        setIsHomeCare(true);
      } else {
        setOutcome(q.yesOutcome);
      }
      setDirection(1);
      setPhase('outcome');
    }
  }

  function handleNo() {
    if (questionIdx === QUESTIONS.length - 1) {
      // Q12 NO → See Paed
      setOutcome({
        level: 'see-paed',
        guidance: 'See a Paediatrician Today',
        detail: "If you're unsure or something doesn't feel right, always trust your instincts and seek medical advice.",
      });
      setDirection(1);
      setPhase('outcome');
    } else {
      setDirection(1);
      setQuestionIdx((i) => i + 1);
    }
  }

  function reset() {
    setDirection(-1);
    setPhase('intro');
    setQuestionIdx(0);
    setOutcome(null);
    setIsHomeCare(false);
  }

  return (
    <div>
      <AnimatePresence mode="wait" custom={direction}>
        {phase === 'intro' && (
          <motion.div
            key="intro"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="space-y-5"
          >
            {/* Response level legend */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Response Levels</h2>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(OUTCOMES) as [OutcomeLevel, typeof OUTCOMES[OutcomeLevel]][]).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <div key={key} className={cn('rounded-lg border p-3 flex items-start gap-2', cfg.bg, cfg.border)}>
                      <span className={cn('h-2.5 w-2.5 rounded-full mt-0.5 flex-shrink-0', cfg.badge)} />
                      <div>
                        <p className={cn('text-xs font-semibold', cfg.text)}>{cfg.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <RedEmergencyStrip />

            <Button onClick={startFlow} className="w-full">
              Begin decision tree <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {phase === 'questions' && (
          <motion.div
            key={`q-${questionIdx}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="space-y-5"
          >
            <ProgressBar current={questionIdx + 1} total={QUESTIONS.length} />

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span className="font-medium">Question {currentQuestion.id}</span>
              <span>of {QUESTIONS.length}</span>
            </div>

            <h2 className="text-base font-semibold leading-snug">{currentQuestion.text}</h2>

            <div className="flex gap-3">
              <Button onClick={handleYes} variant="destructive" className="flex-1">
                Yes
              </Button>
              <Button onClick={handleNo} variant="outline" className="flex-1">
                No
              </Button>
            </div>

            {currentQuestion.noText && (
              <p className="text-xs text-muted-foreground italic">{currentQuestion.noText}</p>
            )}
          </motion.div>
        )}

        {phase === 'outcome' && (
          <motion.div
            key="outcome"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {isHomeCare ? (
              <HomeCareResult onReset={reset} />
            ) : outcome ? (
              <OutcomeCard outcome={outcome} onReset={reset} />
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
