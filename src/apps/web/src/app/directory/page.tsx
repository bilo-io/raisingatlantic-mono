
"use client";

import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Stethoscope } from 'lucide-react';
import { DirectoryHubCards, type DirectorySection } from '@/components/directory/DirectoryHubCards';

export default function DirectoryPage() {
  const { t } = useTranslation();

  const directorySections: DirectorySection[] = [
    {
      title: "Medical Practices",
      description: "Browse affiliated medical practices, their locations, and contact details throughout the region.",
      href: "/directory/practices",
      icon: MapPin
    },
    {
      title: "Clinicians Directory",
      description: "Find health professionals and specialists by their expertise and affiliated practices.",
      href: "/directory/clinicians",
      icon: Stethoscope
    },
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t('directoryPageTitle') || 'Professional Directory'}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('directoryPageContent') || 'Connect with trusted healthcare providers and facilities in the RaisingAtlantic network.'}
            </p>
          </div>

          {/* Navigation Cards */}
          <DirectoryHubCards 
            sections={directorySections} 
            className="md:grid-cols-2 max-w-3xl mx-auto"
          />

          {/* Trust/Info Section */}
          <div className="pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Verified Providers</h3>
                <p className="text-sm text-muted-foreground">Every clinician is vetted for credentials and specializations.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Local Access</h3>
                <p className="text-sm text-muted-foreground">Find practices near you with our integrated location services.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Secure Connecting</h3>
                <p className="text-sm text-muted-foreground">Login to safely message and book with your chosen providers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
