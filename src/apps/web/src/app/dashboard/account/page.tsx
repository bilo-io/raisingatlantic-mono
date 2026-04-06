
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle as UserCircleIcon, Settings, User } from 'lucide-react';

const accountSections = [
  {
    title: "Manage Profile",
    description: "View and update your personal information, contact details, and avatar.",
    href: "/dashboard/account/profile",
    icon: UserCircleIcon
  },
  {
    title: "Application Settings",
    description: "Customize notification preferences, appearance, language, and manage account security.",
    href: "/dashboard/account/settings",
    icon: Settings
  },
];

export default function AccountOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <User className="mr-3 h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight">Account Management</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Welcome to the Account Management section. Here you can manage your personal profile details and
        configure application settings to tailor your experience. Select a category below to proceed.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {accountSections.map((section) => (
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
