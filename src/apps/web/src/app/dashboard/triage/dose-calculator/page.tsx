'use client';

import { motion } from 'framer-motion';
import { Calculator, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DoseCalculator } from '@/components/triage/DoseCalculator';

export default function DoseCalculatorPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
          <Link href="/dashboard/triage">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Triage
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-blue-500/10">
            <Calculator className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Dose Calculator</h1>
            <p className="text-muted-foreground text-sm">
              Weight-based dosing for common children's medications.
            </p>
          </div>
        </div>

        <DoseCalculator />
      </motion.div>
    </div>
  );
}
