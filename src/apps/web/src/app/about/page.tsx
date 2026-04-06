
"use client";

import Image from 'next/image';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTranslation } from 'react-i18next';
import { Info, Users, type LucideIcon } from 'lucide-react'; 

const PageIcon: LucideIcon = Info;
const pageTitleKey = 'aboutPageTitle';

const clinicDirectors = [
  {
    nameKey: 'directorName1',
    roleKey: 'directorRole1',
    imageUrl: '/assets/images/profiles/pic_DrRaphaellaStander.avif',
  },
  {
    nameKey: 'directorName2',
    roleKey: 'directorRole2',
    imageUrl: '/assets/images/profiles/pic_DrKateBrowde.avif',
  },
  {
    nameKey: 'directorName3',
    roleKey: 'directorRole3',
    imageUrl: '/assets/images/profiles/pic_MeganSmith.avif',
  },
  {
    nameKey: 'directorName4',
    roleKey: 'directorRole4',
    imageUrl: '/assets/images/profiles/pic_AmyKallenbach.avif',
  },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="flex-grow">
        {/* Intro Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <PageIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{t(pageTitleKey)}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t('aboutPageContent')}
            </p>
          </div>
        </section>

        {/* Clinic Directors Section */}
        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                {t('clinicDirectorsTitle')}
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                {t('clinicDirectorsIntro')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {clinicDirectors.map((director) => (
                <div key={director.nameKey} className="text-center group flex flex-col items-center">
                  <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full shadow-lg border-4 border-background">
                    <Image
                      src={director.imageUrl}
                      alt={t(director.nameKey)}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{t(director.nameKey)}</h3>
                  <p className="text-sm text-primary">{t(director.roleKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
