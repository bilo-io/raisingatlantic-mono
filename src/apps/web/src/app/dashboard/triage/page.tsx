'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Thermometer, Brain, Heart, Calculator, ChevronRight } from 'lucide-react';

const TRIAGE_FEATURES = [
  {
    href: '/dashboard/triage/fever',
    label: 'Fever',
    description: 'Step-by-step guidance when your child has a high temperature.',
    icon: Thermometer,
    accent: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
  },
  {
    href: '/dashboard/triage/head-injury',
    label: 'Head Injury',
    description: 'Assess a head bump or knock and decide on next steps.',
    icon: Brain,
    accent: 'from-red-500/20 to-rose-500/10 border-red-500/30',
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
  },
  {
    href: '/dashboard/triage/home-care',
    label: 'Home Care',
    description: 'Practical advice for common childhood symptoms at home.',
    icon: Heart,
    accent: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
  },
  {
    href: '/dashboard/triage/dose-calculator',
    label: 'Dose Calculator',
    description: 'Calculate the right medication dose based on your child\'s weight.',
    icon: Calculator,
    accent: 'from-blue-500/20 to-sky-500/10 border-blue-500/30',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function TriagePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Triage</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Guided decision tools to help you act quickly and confidently.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {TRIAGE_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.href} variants={cardVariants} className="h-full">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="h-full"
              >
                <Link
                  href={feature.href}
                  className={`flex flex-col gap-4 p-6 rounded-xl border bg-gradient-to-br ${feature.accent} backdrop-blur-sm transition-shadow hover:shadow-lg h-full`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${feature.iconBg}`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base">{feature.label}</h2>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-xs text-muted-foreground text-center mt-8"
      >
        These tools provide guidance only and do not replace professional medical advice.
        If you are ever unsure, seek medical attention promptly.
      </motion.p>
    </div>
  );
}
