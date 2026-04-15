"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "Is the 'Starter' plan really free forever?",
    answer: "Yes! Our Starter plan is designed to help parents manage 1 child with essential growth tracking and the standard EPI schedule at no cost. We believe every child deserves a secure digital health record."
  },
  {
    question: "Can I share my child's profile with our nanny or au pair?",
    answer: "Yes, our Pro and Premium plans include 'Care Network' access. You can safely invite nannies, au pairs, or grandparents to log meals, sleep, or milestones without giving them full admin access to the medical records."
  },
  {
    question: "Will the PDF exports be accepted by my child's crèche or preschool?",
    answer: "Absolutely. The PDF reports generated in the Pro and Premium tiers are formatted explicitly to provide clear, verifiable proof of immunizations and growth milestones, which is standard for Cape Town preschool and crèche admissions."
  },
  {
    question: "Is my medical data secure and POPIA compliant?",
    answer: "Data privacy is our highest priority. Raising Atlantic is fully compliant with South Africa's Protection of Personal Information Act (POPIA). All medical data is encrypted at rest and in transit."
  },
  {
    question: "What happens if I lose my phone? Is my child's record safe?",
    answer: "Unlike the physical Road to Health booklet, your digital records are securely backed up in the cloud. Simply log in on a new device to access your child's complete medical history instantly."
  }
];

export function PricingFAQ() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our plans and billing.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="hover:no-underline text-lg font-semibold py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
