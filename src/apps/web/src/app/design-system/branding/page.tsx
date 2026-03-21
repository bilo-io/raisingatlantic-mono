
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Baby, Users, Stethoscope } from 'lucide-react';
import Image from 'next/image';
import { DesignSystemLayout } from '@/components/layout/DesignSystemLayout';

const ColorSwatch = ({ color, name, hex }: { color: string; name: string; hex: string }) => (
  <div className="flex flex-col items-center">
    <div className={`w-24 h-24 rounded-lg shadow-md ${color} border`}></div>
    <div className="text-center mt-2">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-muted-foreground">{hex}</p>
    </div>
  </div>
);

const IconDisplay = ({ Icon, name }: { Icon: React.ElementType, name: string }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="h-10 w-10 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">{name}</p>
    </div>
);

export default function BrandingPage() {
  return (
    <DesignSystemLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center">
            <Gem className="mr-3 h-7 w-7 text-primary" />
            <h1 className="font-headline text-2xl font-bold tracking-tight">Branding</h1>
        </div>
        
        <Card>
            <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>
                The primary logo for Raising Atlantic. It should be used with sufficient clear space.
            </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Logo for Light Background</p>
                    <div className="p-8 rounded-lg bg-[#E5E0D8] border flex items-center justify-center h-48 shadow-inner">
                        <Image 
                            src="/assets/images/app-logo-light.svg" 
                            alt="Raising Atlantic Logo (Light)"
                            width={250} 
                            height={60}
                            className="w-[250px] h-auto"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Logo for Dark Background</p>
                    <div className="p-8 rounded-lg bg-[#181D22] border flex items-center justify-center h-48 shadow-inner">
                        <Image 
                            src="/assets/images/app-logo-dark.svg" 
                            alt="Raising Atlantic Logo (Dark)"
                            width={250} 
                            height={60}
                            className="w-[250px] h-auto"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Primary Color Palette</CardTitle>
                <CardDescription>The core colors that define the brand's visual identity.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <ColorSwatch color="bg-primary" name="Primary" hex="#605BFF" />
                <ColorSwatch color="bg-accent" name="Accent" hex="#FF00AA" />
                <ColorSwatch color="bg-destructive" name="Destructive" hex="#F43F5E" />
                <ColorSwatch color="bg-background" name="Sand Background" hex="#E5E0D8" />
                <ColorSwatch color="bg-foreground" name="Obsidian Foreground" hex="#181D22" />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Iconography</CardTitle>
                <CardDescription>Key icons representing core concepts of the application. Uses Lucide Icons.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-8">
                <IconDisplay Icon={Baby} name="Children" />
                <IconDisplay Icon={Users} name="Patients / Users" />
                <IconDisplay Icon={Stethoscope} name="Clinicians" />
                <IconDisplay Icon={Gem} name="Branding" />
            </CardContent>
        </Card>

        </div>
    </DesignSystemLayout>
  );
}
