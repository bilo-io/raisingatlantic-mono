
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, TrendingUp, Award, Syringe } from 'lucide-react';

const recordSections = [
  {
    title: "Growth",
    description: "Track physical development, including height, weight, and other growth metrics over time.",
    href: "/dashboard/records/growth",
    icon: TrendingUp
  },
  {
    title: "Milestones",
    description: "Log developmental milestones such as first steps, words, and cognitive achievements.",
    href: "/dashboard/records/milestones",
    icon: Award
  },
  {
    title: "Vaccinations",
    description: "Keep a detailed record of all vaccinations, dates administered, and upcoming immunizations.",
    href: "/dashboard/records/vaccinations",
    icon: Syringe
  },
];

export default function RecordsOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <ClipboardList className="mr-3 h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight">Child Records Overview</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Welcome to the Child Records section. Here you can manage and view detailed records related to your child's development,
        including their growth, developmental milestones, and vaccination history. Select a category below to view or add records.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recordSections.map((section) => (
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
