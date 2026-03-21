
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, HeartHandshake, Lightbulb, PenTool, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { DesignSystemLayout } from '@/components/layout/DesignSystemLayout';

const principles = [
  {
    icon: Lightbulb,
    title: "Clarity & Simplicity",
    description: "Our interface is designed to be intuitive and straightforward, reducing cognitive load for parents and clinicians. We prioritize clear navigation and easily digestible information.",
  },
  {
    icon: HeartHandshake,
    title: "Empathetic & Supportive",
    description: "The design should feel warm, approachable, and encouraging. The color palette, typography, and language work together to create a calming and supportive environment for users.",
  },
  {
    icon: PenTool,
    title: "Trustworthy & Professional",
    description: "As a tool for child development, our visual identity must convey professionalism and trustworthiness. This is achieved through a clean layout, consistent branding, and reliable performance.",
  },
];

export default function VisualIdentityPage() {
  return (
    <DesignSystemLayout>
        <div className="flex flex-col gap-8">
        <div className="flex items-center">
            <Fingerprint className="mr-3 h-7 w-7 text-primary" />
            <h1 className="font-headline text-2xl font-bold tracking-tight">Visual Identity</h1>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>Our Design Philosophy</CardTitle>
            <CardDescription>
                The core principles and visual language that define the user experience, ensuring a consistent, supportive, and professional application.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
            <section>
                <h2 className="font-headline text-xl font-semibold mb-4">Core Principles</h2>
                <div className="grid gap-6 md:grid-cols-3">
                {principles.map((p) => (
                    <div key={p.title} className="p-6 rounded-lg bg-muted/50 border">
                    <p.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    </div>
                ))}
                </div>
            </section>

            <section>
                <h2 className="font-headline text-xl font-semibold mb-4">Tone of Voice</h2>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            Our voice is professional, yet warm and accessible. We communicate clearly and concisely, avoiding jargon where possible. The tone should always be encouraging and supportive, empowering users without being prescriptive.
                        </p>
                    </CardContent>
                </Card>
            </section>
            
            <section>
                <h2 className="font-headline text-xl font-semibold mb-4 flex items-center"><ImageIcon className="mr-2 h-5 w-5"/>Imagery</h2>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <p className="text-muted-foreground">
                        Imagery should be authentic, warm, and positive. We prefer photos of real-life interactions that feel natural and unposed. Illustrations and icons should be clean, simple, and align with our brand colors. All visuals should be inclusive and representative of diverse families and children. Placeholder images are used for layout purposes and should be replaced with high-quality, relevant photos.
                    </p>
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="Placeholder for imagery style"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-md"
                        data-ai-hint="happy child parent"
                    />
                </div>
            </section>

            </CardContent>
        </Card>
        </div>
    </DesignSystemLayout>
  );
}
