"use client";

import { MessageCircleQuestion } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';

const faqs = [
  { questionKey: 'faqQuestionSecurity', answerKey: 'faqAnswerSecurity' },
  { questionKey: 'faqQuestionCollaboration', answerKey: 'faqAnswerCollaboration' },
  { questionKey: 'faqQuestionTracking', answerKey: 'faqAnswerTracking' },
  { questionKey: 'faqQuestionDevices', answerKey: 'faqAnswerDevices' },
];

export function FaqSection() {
  const { t } = useTranslation();
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <MessageCircleQuestion className="h-12 w-12 text-primary mx-auto mb-4" />
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
