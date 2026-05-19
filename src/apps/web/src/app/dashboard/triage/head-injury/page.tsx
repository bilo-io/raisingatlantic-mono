'use client';

import { motion } from 'framer-motion';
import { Brain, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeadInjuryFlow } from '@/components/triage/HeadInjuryFlow';

export default function HeadInjuryPage() {
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
          <div className="p-2.5 rounded-lg bg-red-500/10">
            <Brain className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Head Injury</h1>
            <p className="text-muted-foreground text-sm">
              Step-by-step guide after your child bumps or injures their head.
            </p>
          </div>
        </div>

        <HeadInjuryFlow />

        <p className="text-xs text-muted-foreground text-center mt-6">
          Prepared by your paediatrician for guidance only. This guide does not replace professional
          medical assessment. If ever unsure, seek medical advice promptly.
        </p>
      </motion.div>
    </div>
  );
}
