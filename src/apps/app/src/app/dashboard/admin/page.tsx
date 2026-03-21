
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Settings, Shield } from 'lucide-react';

const adminSections = [
  {
    title: "User Management",
    description: "Manage user accounts, roles, and permissions within the application.",
    href: "/dashboard/admin/users",
    icon: Users,
    aiHint: "user group multiple"
  },
  {
    title: "System Settings",
    description: "Configure global application settings, integrations, and maintenance tasks.",
    href: "/dashboard/admin/system",
    icon: Settings,
    aiHint: "gears settings cog"
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Shield className="mr-3 h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight">Administration Panel</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Welcome to the Administration Panel. From here, you can manage users, configure system settings,
        and perform other administrative tasks. Select a category below to proceed.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {adminSections.map((section) => (
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
