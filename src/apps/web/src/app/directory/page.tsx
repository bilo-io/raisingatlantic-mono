
"use client";

import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, type LucideIcon } from 'lucide-react';

const PageIcon: LucideIcon = Search;
const pageTitleKey = 'directoryPageTitle';
const pageContentKey = 'directoryPageContent';

export default function DirectoryPage() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <Card className="max-w-3xl mx-auto my-8 shadow-xl">
          <CardHeader>
            <div className="flex items-center mb-2">
              <PageIcon className="h-8 w-8 text-primary mr-3" />
              <CardTitle className="font-headline text-3xl md:text-4xl">{t(pageTitleKey)}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(pageContentKey)}
            </p>
            {/* TODO: Add search/filter components and results display here */}
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
