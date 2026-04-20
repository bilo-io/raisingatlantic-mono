'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const BlogHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Background Orbs */}
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-full -translate-x-1/2 blur-[120px]">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/10" />
      </div>

      <div className="container mx-auto px-4 max-w-screen-2xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
              Raising Atlantic Blog
            </span>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Insights into the <span className="text-primary">Future of Pediatrics</span>
            </h1>
            <p className="text-xl leading-relaxed text-muted-foreground">
              Deep dives into child development, clinical automation, and modern healthcare strategies for parents and clinicians in South Africa.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
