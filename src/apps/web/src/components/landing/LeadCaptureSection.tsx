"use client";

import { Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LeadCaptureForm } from '@/components/landing/LeadCaptureForm';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-bg';

export function LeadCaptureSection() {
  const { t } = useTranslation();
  return (
    <AnimatedGradientBackground
      variant="ocean"
      colors={["#D97757", "#B85F41", "#DCD9D1", "#EAE7DF"]}
      speed={14}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30">
          <Lightbulb className="h-10 w-10 text-white" />
        </div>
        <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6 text-white">{t('leadCaptureTitle')}</h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          {t('leadCaptureSubtitle')}
        </p>
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl">
          <LeadCaptureForm />
        </div>
      </div>
    </AnimatedGradientBackground>
  );
}
