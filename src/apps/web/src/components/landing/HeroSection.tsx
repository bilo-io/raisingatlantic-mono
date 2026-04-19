"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export function HeroSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  return (
    <section className="relative py-20 md:py-32 min-h-[600px] flex items-center">
      {/* Video Background blended under gradient orbs */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
          src="/assets/videos/vid-gradient-background.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-30" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        <div className="mb-10 w-[350px] md:w-[600px] animate-in fade-in zoom-in duration-1000">
          <Image
            src={resolvedTheme === 'dark'
              ? '/assets/images/app-branding-dark.svg'
              : '/assets/images/app-branding-light.svg'}
            alt="Raising Atlantic"
            width={600}
            height={150}
            className="w-full h-auto drop-shadow-2xl"
            priority
          />
        </div>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          {t('heroSubtitle')}
        </p>
        <div className="space-x-4">
          <Button size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/signup">{t('heroButtonGetStarted')}</Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            asChild 
            className="hover-gradient-border bg-transparent border-white text-white shadow-lg transition-all"
          >
            <a href="#features">{t('heroButtonLearnMore')}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
