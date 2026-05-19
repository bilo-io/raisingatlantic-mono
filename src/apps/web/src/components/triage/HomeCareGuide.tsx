'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Zap, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

type Symptom = {
  id: string;
  label: string;
  icon: typeof Thermometer;
  color: string;
  activeColor: string;
  iconColor: string;
  advice?: string;
  adviceNode?: React.ReactNode;
};

const SYMPTOMS: Symptom[] = [
  {
    id: 'fever',
    label: 'Fever',
    icon: Thermometer,
    color: 'border-amber-400/50 bg-amber-500/5 hover:border-amber-400',
    activeColor: 'border-amber-400 bg-amber-500/10',
    iconColor: 'text-amber-500',
    advice: `Use full weight-based dose of Panado every 4–6 hours. If fever or discomfort persists, it's safe to also give an NSAID (Nurofen, Ponstan, Panamor). These work differently and can be given together or spaced — don't wait for very high fever.

Reassess after 30–60 min. If your child perks up, you can continue monitoring at home. If the fever has not come down or your child is not improving, seek medical advice.`,
  },
  {
    id: 'seizure',
    label: 'Seizure',
    icon: Zap,
    color: 'border-red-400/50 bg-red-500/5 hover:border-red-400',
    activeColor: 'border-red-400 bg-red-500/10',
    iconColor: 'text-red-500',
    adviceNode: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-foreground/90">
          Lay child on their side (recovery position). Do not put anything in their mouth.
        </p>
        <p className="text-sm leading-relaxed text-foreground/90">
          If this is the first seizure, go to the emergency room or your paediatrician immediately.
        </p>
        <p className="text-sm leading-relaxed text-foreground/90">
          Time the seizure. If it lasts more than 5 minutes, call:
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="tel:10177" className="flex flex-col items-center justify-center rounded-lg px-3 py-2.5 min-w-[72px] bg-red-500/10 border border-red-400/40 hover:bg-red-500/20 active:opacity-70 transition-opacity">
            <span className="text-sm font-bold text-red-600 dark:text-red-400">10177</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Ambulance</span>
          </a>
          <a href="tel:112" className="flex flex-col items-center justify-center rounded-lg px-3 py-2.5 min-w-[72px] bg-red-500/10 border border-red-400/40 hover:bg-red-500/20 active:opacity-70 transition-opacity">
            <span className="text-sm font-bold text-red-600 dark:text-red-400">112</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Any mobile</span>
          </a>
        </div>
      </div>
    ),
  },
  {
    id: 'vomiting',
    label: 'Vomiting everything',
    icon: Droplets,
    color: 'border-blue-400/50 bg-blue-500/5 hover:border-blue-400',
    activeColor: 'border-blue-400 bg-blue-500/10',
    iconColor: 'text-blue-500',
    advice: `Remember not to worry about food — only about fluid. Stop all food and milk for 1–2 hours after vomiting.

Give Zofran if available. After the pause, offer small sips (5–10 ml) of oral rehydration solution (like Rehidrat, Hydrol, or homemade ORS) every 5–10 minutes using a spoon or syringe.

If they vomit again, wait 30 minutes and try smaller amounts. Once they keep fluids down for a few hours, slowly reintroduce milk or bland food (e.g. rice, banana).`,
  },
  {
    id: 'diarrhoea',
    label: 'Large volume diarrhoea',
    icon: Wind,
    color: 'border-emerald-400/50 bg-emerald-500/5 hover:border-emerald-400',
    activeColor: 'border-emerald-400 bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    advice: `Remember not to worry about food — only about fluid. Diarrhoea is common in children and often caused by a virus. Keep your child hydrated. Offer small, frequent sips of rehydration solution.

Breastfeeding and formula should continue. Don't stop feeds unless advised. Avoid sugary juices and fizzy drinks as they can make diarrhoea worse.

Offer bland foods (like banana, rice, toast) if your child is hungry. Check for signs of dehydration: dry mouth, no tears when crying, sunken eyes, less urine.`,
  },
];

export function HomeCareGuide() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedSymptom = SYMPTOMS.find((s) => s.id === selected);

  return (
    <div className="space-y-5">
      {/* Symptom selector */}
      <div className="grid grid-cols-2 gap-3">
        {SYMPTOMS.map((symptom) => {
          const Icon = symptom.icon;
          const isActive = selected === symptom.id;
          return (
            <motion.button
              key={symptom.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setSelected(isActive ? null : symptom.id)}
              className={cn(
                'flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-colors duration-200',
                isActive ? symptom.activeColor : symptom.color
              )}
            >
              <Icon className={cn('h-5 w-5', symptom.iconColor)} />
              <span className="text-sm font-medium leading-tight">{symptom.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Advice panel */}
      <AnimatePresence mode="wait">
        {selectedSymptom && (
          <motion.div
            key={selectedSymptom.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn('rounded-xl border p-5 space-y-3', selectedSymptom.activeColor)}
          >
            <div className="flex items-center gap-2">
              <selectedSymptom.icon className={cn('h-4 w-4', selectedSymptom.iconColor)} />
              <span className="font-semibold text-sm">{selectedSymptom.label}</span>
            </div>
            {selectedSymptom.adviceNode ?? (
              <div className="space-y-3">
                {selectedSymptom.advice!.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/90">
                    {para}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground text-center py-4"
        >
          Select a symptom above to see home care advice.
        </motion.p>
      )}
    </div>
  );
}
