"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, BarChart, Smile } from 'lucide-react';
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

const services = [
  { icon: Users, titleKey: 'serviceCollaborativeTitle', descriptionKey: 'serviceCollaborativeDescription', width: 400, height: 300 },
  { icon: BarChart, titleKey: 'serviceProgressTitle', descriptionKey: 'serviceProgressDescription', width: 400, height: 300 },
  { icon: Smile, titleKey: 'serviceInsightsTitle', descriptionKey: 'serviceInsightsDescription', width: 400, height: 300 },
];

const ServiceCard = ({ service, currentTheme }: { service: typeof services[0], currentTheme: string | undefined }) => {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState(() => getPlaceholderUrl(service.width, service.height, 'light'));
  const ServiceIcon = service.icon;

  useEffect(() => {
    if (currentTheme) {
      setImgSrc(getPlaceholderUrl(service.width, service.height, currentTheme));
    }
  }, [currentTheme, service.width, service.height]);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="mb-4 flex justify-center"><ServiceIcon className="h-10 w-10 text-primary" /></div>
        <CardTitle className="font-headline text-center">{t(service.titleKey)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={imgSrc} alt={t(service.titleKey) as string} width={service.width} height={service.height} className="rounded-md mb-4" />
        <p className="text-muted-foreground text-center">{t(service.descriptionKey)}</p>
      </CardContent>
    </Card>
  );
};

export function ServicesSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  
  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('servicesSectionTitle')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('servicesSectionSubtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.titleKey} service={service} currentTheme={resolvedTheme} />
          ))}
        </div>
      </div>
    </section>
  );
}
