
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, UserCheck, FileCheck } from 'lucide-react';

const verificationSections = [
  {
    title: "Verify Clinicians",
    description: "Review and approve clinician accounts, manage credentials, and ensure compliance.",
    href: "/dashboard/verifications/clinicians",
    icon: UserCheck
  },
  {
    title: "Verify Records",
    description: "Audit and verify the integrity of child records, ensuring data accuracy and completeness.",
    href: "/dashboard/verifications/records",
    icon: FileCheck
  },
];

export default function VerificationsOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <ShieldCheck className="mr-3 h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight">Verifications Management</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Welcome to the Verifications Management section. Here you can oversee and manage the verification processes
        for clinicians and child records to maintain platform integrity and compliance.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {verificationSections.map((section) => (
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
