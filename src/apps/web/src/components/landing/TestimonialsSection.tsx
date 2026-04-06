"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const getPlaceholderUrl = (width: number, height: number, currentTheme: string | undefined): string => {
  const lightBg = "E5E0D8";
  const lightText = "6A6154";
  const darkBg = "181D22";
  const darkText = "C6BAA8";

  const bg = currentTheme === 'dark' ? darkBg : lightBg;
  const text = currentTheme === 'dark' ? darkText : lightText;
  return `https://placehold.co/${width}x${height}/${bg}/${text}.png`;
};

const testimonials = [
  { quoteKey: 'testimonialQuote1', nameKey: 'testimonialName1', roleKey: 'testimonialRole1', width: 50, height: 50 },
  { quoteKey: 'testimonialQuote2', nameKey: 'testimonialName2', roleKey: 'testimonialRole2', width: 50, height: 50 },
  { quoteKey: 'testimonialQuote3', nameKey: 'testimonialName3', roleKey: 'testimonialRole3', width: 50, height: 50 },
  { quoteKey: 'testimonialQuote4', nameKey: 'testimonialName4', roleKey: 'testimonialRole4', width: 50, height: 50 },
  { quoteKey: 'testimonialQuote5', nameKey: 'testimonialName5', roleKey: 'testimonialRole5', width: 50, height: 50 },
  { quoteKey: 'testimonialQuote6', nameKey: 'testimonialName6', roleKey: 'testimonialRole6', width: 50, height: 50 },
  { quoteKey: 'testimonialQuote7', nameKey: 'testimonialName7', roleKey: 'testimonialRole7', width: 50, height: 50 },
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
    <Card className="shadow-lg flex flex-col h-full bg-background">
      <CardContent className="pt-6 flex-grow">
        <p className="italic text-muted-foreground mb-4">"{t(testimonial.quoteKey)}"</p>
      </CardContent>
      <CardHeader className="flex flex-row items-center space-x-4 border-t pt-4 mt-auto">
        <Image src={avatarSrc} alt={t(testimonial.nameKey) as string} width={testimonial.width} height={testimonial.height} className="rounded-full" />
        <div>
          <CardTitle className="text-base font-semibold">{t(testimonial.nameKey)}</CardTitle>
          <CardDescription className="text-sm">{t(testimonial.roleKey)}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export function TestimonialsSection() {
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
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
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
