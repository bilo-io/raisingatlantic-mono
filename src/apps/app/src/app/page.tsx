
"use client"; // Required for useTranslation hook

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Users, BarChart, Smile, MessageCircleQuestion, Lightbulb, ShieldCheck, Sparkles, Construction } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { LeadCaptureForm } from '@/components/landing/LeadCaptureForm';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Helper function to generate theme-aware placeholder URLs
const getPlaceholderUrl = (width: number, height: number, currentTheme: string | undefined): string => {
  const lightBg = "E5E0D8"; // Sand Background
  const lightText = "6A6154"; // Muted Foreground
  const darkBg = "181D22";   // Obsidian (Sidebar/Card)
  const darkText = "C6BAA8";  // Sand Foreground

  const bg = currentTheme === 'dark' ? darkBg : lightBg;
  const text = currentTheme === 'dark' ? darkText : lightText;

  return `https://placehold.co/${width}x${height}/${bg}/${text}.png`;
};


function HeroSection() {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const { resolvedTheme } = useTheme();

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden min-h-[600px] flex items-center">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          // Ensure you have this video file in public/assets/videos/ or update path
          src="/assets/videos/vid-gradient-background.mp4" 
        >
          Your browser does not support the video tag.
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        <div className="mb-10 w-[350px] md:w-[600px] animate-in fade-in zoom-in duration-1000">
           <Image 
              src={resolvedTheme === 'dark' ? '/assets/images/app-branding-dark.svg' : '/assets/images/app-branding-light.svg'} 
              alt="Raising Atlantic Branding"
              width={600} 
              height={150}
              className="w-full h-auto drop-shadow-2xl"
              priority
           />
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white drop-shadow-md">
          {t('heroTitle')}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          {t('heroSubtitle')}
        </p>
        <div className="space-x-4">
          <Button size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/signup">{t('heroButtonGetStarted')}</Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            asChild 
            className="bg-transparent border-white text-white shadow-lg hover:shadow-accent/50 transition-shadow hover:bg-accent hover:border-accent hover:text-accent-foreground"
          >
            <a href="#features">{t('heroButtonLearnMore')}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Section: Services
const services = [
  {
    icon: Users, // Store component type
    titleKey: 'serviceCollaborativeTitle',
    descriptionKey: 'serviceCollaborativeDescription',
    width: 400,
    height: 300,
    aiHint: "team collaboration"
  },
  {
    icon: BarChart, // Store component type
    titleKey: 'serviceProgressTitle',
    descriptionKey: 'serviceProgressDescription',
    width: 400,
    height: 300,
    aiHint: "charts graphs"
  },
  {
    icon: Smile, // Store component type
    titleKey: 'serviceInsightsTitle',
    descriptionKey: 'serviceInsightsDescription',
    width: 400,
    height: 300,
    aiHint: "brain lightbulb"
  },
];

const ServiceCard = ({ service, currentTheme }: { service: typeof services[0], currentTheme: string | undefined }) => {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState(() => getPlaceholderUrl(service.width, service.height, 'light'));
  const ServiceIcon = service.icon; // Assign to a capitalized variable

  useEffect(() => {
    if (currentTheme) {
      setImgSrc(getPlaceholderUrl(service.width, service.height, currentTheme));
    }
  }, [currentTheme, service.width, service.height]);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="mb-4 flex justify-center"><ServiceIcon className="h-10 w-10 text-primary" /></div>
        <CardTitle className="font-headline text-center">{t(service.titleKey)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={imgSrc} alt={t(service.titleKey)} width={service.width} height={service.height} className="rounded-md mb-4" data-ai-hint={service.aiHint} />
        <p className="text-muted-foreground text-center">{t(service.descriptionKey)}</p>
      </CardContent>
    </Card>
  );
};

function ServicesSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  
  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <ShieldCheck className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('servicesSectionTitle')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('servicesSectionSubtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.titleKey} service={service} currentTheme={resolvedTheme} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Section: Features
const features = [
  { nameKey: 'featureSecureProfiles', icon: CheckCircle },
  { nameKey: 'featureRBAC', icon: CheckCircle },
  { nameKey: 'featureNoteTaking', icon: CheckCircle },
  { nameKey: 'featureAvatarUploads', icon: CheckCircle },
  { nameKey: 'featureResponsiveDesign', icon: CheckCircle },
  { nameKey: 'featureExpertSupport', icon: CheckCircle },
];

function FeaturesSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [featuresImageUrl, setFeaturesImageUrl] = useState(() => getPlaceholderUrl(800, 500, 'light'));

  useEffect(() => {
    if (resolvedTheme) {
      setFeaturesImageUrl(getPlaceholderUrl(800, 500, resolvedTheme));
    }
  }, [resolvedTheme]);

  return (
    <section id="features" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Sparkles className="h-12 w-12 text-primary-foreground mx-auto mb-4" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('featuresSectionTitle')}</h2>
          <p className="text-primary-foreground/90 max-w-xl mx-auto">
            {t('featuresSectionSubtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const FeatureIcon = feature.icon; // Assign to a capitalized variable for JSX
            return (
              <div key={feature.nameKey} className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white p-6 rounded-xl hover:bg-white/20 transition-all group shadow-lg">
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <FeatureIcon className="h-5 w-5 flex-shrink-0" />
                </div>
                <span className="font-semibold text-lg">{t(feature.nameKey)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
            <Image 
              src={featuresImageUrl}
              alt={t('featuresImageAlt')}
              width={800}
              height={500}
              className="rounded-lg shadow-xl mx-auto"
              data-ai-hint="interface features"
            />
        </div>
      </div>
    </section>
  );
}

// Section: FAQ
const faqs = [
  {
    questionKey: 'faqQuestionSecurity',
    answerKey: 'faqAnswerSecurity',
  },
  {
    questionKey: 'faqQuestionCollaboration',
    answerKey: 'faqAnswerCollaboration',
  },
  {
    questionKey: 'faqQuestionTracking',
    answerKey: 'faqAnswerTracking',
  },
  {
    questionKey: 'faqQuestionDevices',
    answerKey: 'faqAnswerDevices',
  },
];

function FaqSection() {
  const { t } = useTranslation();
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <MessageCircleQuestion className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('faqSectionTitle')}</h2>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="font-medium text-left">{t(faq.questionKey)}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{t(faq.answerKey)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// Section: Testimonials
const testimonials = [
  {
    quoteKey: 'testimonialQuote1',
    nameKey: 'testimonialName1',
    roleKey: 'testimonialRole1',
    width: 50, 
    height: 50,
    aiHint: 'happy parent'
  },
  {
    quoteKey: 'testimonialQuote2',
    nameKey: 'testimonialName2',
    roleKey: 'testimonialRole2',
    width: 50,
    height: 50,
    aiHint: 'professional doctor'
  },
  {
    quoteKey: 'testimonialQuote3',
    nameKey: 'testimonialName3',
    roleKey: 'testimonialRole3',
    width: 50,
    height: 50,
    aiHint: 'smiling teacher'
  },
  {
    quoteKey: 'testimonialQuote4',
    nameKey: 'testimonialName4',
    roleKey: 'testimonialRole4',
    width: 50,
    height: 50,
    aiHint: 'grateful user'
  },
  {
    quoteKey: 'testimonialQuote5',
    nameKey: 'testimonialName5',
    roleKey: 'testimonialRole5',
    width: 50,
    height: 50,
    aiHint: 'community leader'
  },
  {
    quoteKey: 'testimonialQuote6',
    nameKey: 'testimonialName6',
    roleKey: 'testimonialRole6',
    width: 50,
    height: 50,
    aiHint: 'satisfied customer'
  },
  {
    quoteKey: 'testimonialQuote7',
    nameKey: 'testimonialName7',
    roleKey: 'testimonialRole7',
    width: 50,
    height: 50,
    aiHint: 'happy client'
  },
];

const TestimonialCard = ({ testimonial, currentTheme }: { testimonial: typeof testimonials[0], currentTheme: string | undefined }) => {
  const { t } = useTranslation();
  const [avatarSrc, setAvatarSrc] = useState(() => getPlaceholderUrl(testimonial.width, testimonial.height, 'light'));

  useEffect(() => {
    if (currentTheme) {
      setAvatarSrc(getPlaceholderUrl(testimonial.width, testimonial.height, currentTheme));
    }
  }, [currentTheme, testimonial.width, testimonial.height]);

  return (
    <Card className="shadow-lg flex flex-col h-full bg-background"> {/* Added h-full and bg-background */}
      <CardContent className="pt-6 flex-grow">
        <p className="italic text-muted-foreground mb-4">"{t(testimonial.quoteKey)}"</p>
      </CardContent>
      <CardHeader className="flex flex-row items-center space-x-4 border-t pt-4 mt-auto">
        <Image src={avatarSrc} alt={t(testimonial.nameKey)} width={testimonial.width} height={testimonial.height} className="rounded-full" data-ai-hint={testimonial.aiHint} />
        <div>
          <CardTitle className="text-base font-semibold">{t(testimonial.nameKey)}</CardTitle>
          <CardDescription className="text-sm">{t(testimonial.roleKey)}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

function TestimonialsSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, testimonials.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (testimonials.length === 0) {
      return null;
  }

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Users className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('testimonialsSectionTitle')}</h2>
        </div>
        
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 p-8">
                  <TestimonialCard testimonial={testimonial} currentTheme={resolvedTheme} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-2 pt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ease-in-out focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring 
                  ${currentIndex === index ? 'bg-primary scale-125' : 'bg-muted hover:bg-primary/70'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


// Section: Lead Capture / Call to Action
function LeadCaptureSection() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30">
          <Lightbulb className="h-10 w-10 text-white" />
        </div>
        <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6 text-white">{t('leadCaptureTitle')}</h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          {t('leadCaptureSubtitle')}
        </p>
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl">
          <LeadCaptureForm />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <FaqSection />
      <TestimonialsSection />
      <LeadCaptureSection />
    </PublicLayout>
  );
}
