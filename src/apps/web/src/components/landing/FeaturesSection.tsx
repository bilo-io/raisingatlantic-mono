"use client";

import Image from 'next/image';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const getPlaceholderUrl = (width: number, height: number, currentTheme: string | undefined): string => {
  const lightBg = "E5E0D8";
  const lightText = "6A6154";
  const darkBg = "181D22";
  const darkText = "C6BAA8";

  const bg = currentTheme === 'dark' ? darkBg : lightBg;
  const text = currentTheme === 'dark' ? darkText : lightText;
  return `https://placehold.co/${width}x${height}/${bg}/${text}.png`;
};

const features = [
  { nameKey: 'featureSecureProfiles', icon: CheckCircle },
  { nameKey: 'featureRBAC', icon: CheckCircle },
  { nameKey: 'featureNoteTaking', icon: CheckCircle },
  { nameKey: 'featureAvatarUploads', icon: CheckCircle },
  { nameKey: 'featureResponsiveDesign', icon: CheckCircle },
  { nameKey: 'featureExpertSupport', icon: CheckCircle },
];

export function FeaturesSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [featuresImageUrl, setFeaturesImageUrl] = useState(() => getPlaceholderUrl(800, 500, 'light'));

  useEffect(() => {
    if (resolvedTheme) {
      setFeaturesImageUrl(getPlaceholderUrl(800, 500, resolvedTheme));
    }
  }, [resolvedTheme]);

  return (
    <section id="features" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Sparkles className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-white font-headline text-3xl md:text-4xl font-bold mb-4">
            {t('featuresSectionTitle')}
          </h2>
          <p className="text-white max-w-xl mx-auto">
            {t('featuresSectionSubtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={feature.nameKey} className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all group shadow-lg">
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <FeatureIcon className="h-5 w-5 flex-shrink-0" />
                </div>
                <span className="font-semibold text-lg">{t(feature.nameKey)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
            <Image 
              src={featuresImageUrl}
              alt={t('featuresImageAlt') as string}
              width={800}
              height={500}
              className="rounded-lg shadow-xl mx-auto"
              data-ai-hint="interface features"
            />
        </div>
      </div>
    </section>
  );
}
