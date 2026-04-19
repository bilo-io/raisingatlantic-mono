"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  highlighted?: boolean;
  theme?: 'dark' | 'gradient' | 'light' | 'glass-dark' | 'enterprise';
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for parents just getting started with tracking their child's health.",
    features: [
      "1 Child Profile",
      "Essential Growth Tracking",
      "Standard EPI Schedule",
      "Basic Milestone Charts",
      "Mobile App Access"
    ],
    buttonText: "Get Started",
    buttonHref: "/signup",
    theme: 'dark',
    buttonVariant: 'default'
  },
  {
    name: "Pro",
    price: "R99",
    description: "Ideal for growing families needing more data and caregiver access.",
    features: [
      "Up to 3 Children",
      "Advanced Growth Analytics",
      "Nanny/Au Pair Access",
      "Crèche Admission PDF Reports",
      "Direct Clinician Sharing"
    ],
    buttonText: "Upgrade to Pro",
    buttonHref: "/signup",
    theme: 'gradient',
    buttonVariant: 'outline'
  },
  {
    name: "Premium",
    price: "R220",
    description: "Elite oversight for large families and wellness connoisseurs requiring peak clinical coordination.",
    features: [
      "Unlimited Children",
      "Multi-Caregiver Network",
      "Allergy & Diet Tracking",
      "Priority Clinician Messaging",
      "Dedicated App Support",
      "Comprehensive Export"
    ],
    buttonText: "Get Premium",
    buttonHref: "/signup",
    theme: 'glass-dark',
    buttonVariant: 'outline'
  },
  {
    name: "Business Clinic",
    price: "Custom",
    description: "Scalable clinical infrastructure for multidisciplinary practices and healthcare chains.",
    features: [
      "Multiple Practice Branches",
      "Unlimited Clinician Logins",
      "Advanced Practice Analytics",
      "Custom API Integrations",
      "Dedicated Account Manager",
      "SLA & Training Support"
    ],
    buttonText: "Contact Sales",
    buttonHref: "/contact",
    theme: 'enterprise',
    buttonVariant: 'outline'
  }
];

export function PricingTiers() {
  return (
    <section className="py-20 bg-background relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(217,119,87,0.05),transparent_50%)] pointer-events-none" />
      <div className="container mx-auto px-4 z-10 relative">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex h-full"
            >
              <Card 
                className={cn(
                  "relative flex flex-col w-full h-full transition-all duration-300 border-2 group rounded-xl",
                  tier.theme === 'dark' && "bg-card text-card-foreground border-border",
                  tier.theme === 'gradient' && "bg-primary text-primary-foreground border-transparent shadow-xl",
                  tier.theme === 'light' && "bg-white text-gray-900 border-gray-200",
                  tier.theme === 'glass-dark' && "bg-slate-900/90 backdrop-blur-xl text-white border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                  tier.theme === 'enterprise' && "bg-white text-gray-900 border-primary/20 shadow-xl"
                )}
              >
                {tier.theme === 'glass-dark' && (
                  <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                )}
                
                {tier.theme === 'gradient' && (
                  <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none" />
                )}

              <CardHeader className="text-center pt-8 pb-4">
                <CardTitle className={cn(
                  "text-2xl font-bold mb-2",
                  tier.theme === 'gradient' || tier.theme === 'glass-dark' ? "text-white" : "",
                  tier.theme === 'enterprise' ? "text-primary" : ""
                )}>
                  {tier.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-1 my-4">
                  <span className={cn(
                    "text-4xl md:text-5xl font-bold",
                    tier.theme === 'gradient' || tier.theme === 'glass-dark' ? "text-white" : ""
                  )}>
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && tier.price !== "Free" && (
                    <span className={cn(
                      "text-muted-foreground",
                      tier.theme === 'gradient' || tier.theme === 'glass-dark' ? "text-white/80" : ""
                    )}>/ month</span>
                  )}
                </div>
                <CardDescription className={cn(
                  "mt-2",
                  tier.theme === 'gradient' || tier.theme === 'glass-dark' ? "text-white/90" : ""
                )}>
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={cn(
                        "h-5 w-5 shrink-0 mt-0.5",
                        tier.theme === 'gradient' || tier.theme === 'glass-dark' ? "text-white" : "text-primary"
                      )} />
                      <span className={cn(
                        "text-sm",
                        tier.theme === 'gradient' || tier.theme === 'glass-dark' ? "text-white/90" : ""
                      )}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pb-8 pt-4 mt-auto">
                <Button 
                  variant={tier.buttonVariant || 'default'}
                  className={cn(
                    "w-full h-12 text-lg font-bold transition-all z-10",
                    tier.theme === 'dark' && "shadow-lg hover:shadow-primary/40",
                    tier.theme === 'gradient' && "!bg-white !text-slate-900 border-none hover:!bg-slate-100 shadow-xl ring-2 ring-white/20",
                    tier.theme === 'light' && "bg-[#4285F4] text-white hover:bg-[#4285F4]/90 shadow-lg",
                    tier.theme === 'glass-dark' && "bg-white text-slate-900 border-transparent hover:text-slate-900 hover:bg-white/90 shadow-[0_10px_20px_rgba(255,255,255,0.1)]",
                    tier.theme === 'enterprise' && "bg-slate-900 text-white border-transparent hover:text-white hover:bg-slate-800 shadow-xl"
                  )}
                  asChild
                >
                  <Link href={tier.buttonHref}>{tier.buttonText}</Link>
                </Button>
              </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
