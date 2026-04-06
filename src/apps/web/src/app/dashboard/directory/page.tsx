import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Stethoscope, Search } from 'lucide-react';

const directorySections = [
  {
    title: "Medical Practices",
    description: "Browse and manage affiliated medical practices and their details.",
    href: "/dashboard/directory/practices",
    icon: MapPin
  },
  {
    title: "Clinicians Directory",
    description: "View and manage clinician profiles, specializations, and contact information.",
    href: "/dashboard/directory/clinicians",
    icon: Stethoscope
  },
];

export default function DirectoryOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Search className="mr-3 h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight">Directory</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Welcome to the Directory. This section provides access to information about medical practices
        and clinicians associated with the platform. Select a category below to proceed.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {directorySections.map((section) => (
          <Link href={section.href} key={section.title} className="group">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:border-primary">
              <CardHeader className="items-center text-center">
                <section.icon className="h-12 w-12 text-primary mb-3 transition-transform group-hover:scale-110" />
                <CardTitle className="font-headline text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center">
                  {section.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
