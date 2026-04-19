"use client";

import React from 'react';
import { Check, Building2, Users, UserCog, TrendingUp, ShieldCheck, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-bg';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function PricingBusinessClinic() {
  const features = [
    "Unified Clinical & Admin Platform",
    "Enterprise-wide EPI Schedules",
    "Advanced Growth Velocity Tracking",
    "Multi-Practice Data Isolation",
    "Full Clinical Data Export",
    "Audit Logs & Security Controls"
  ];

  return (
    <section id="business-clinic" className="relative">
      <AnimatedGradientBackground
        variant="ocean"
        colors={["#1E40AF", "#3B82F6", "#8B5CF6", "#06B6D4"]}
        speed={12}
        intensity={150}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6">
                Business Clinic
              </h2>
              <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                Enterprise-grade clinical infrastructure designed for healthcare chains, 
                integrating clinician workflows and admin operations on one unified platform.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto mb-16">
            {/* Left Column: Value Prop & Features */}
            <div className="lg:col-span-7 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                    <div className="bg-white/20 p-1.5 rounded-full">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white font-medium">{feature}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-cyan-900/40 backdrop-blur-md border border-cyan-400/30 p-8 rounded-2xl shadow-xl"
              >
                <div className="flex gap-4 items-start">
                  <div className="bg-cyan-400/20 p-3 rounded-full">
                    <Users className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-white mb-2">One Unified Platform</h3>
                    <p className="text-white/80 leading-relaxed">
                      Manage practice administration and clinician workflows—including clinical note-taking, 
                      automated health alerts, and patient roster management—via a single, synchronized interface 
                      for seamless organizational oversight.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-blue-900/40 backdrop-blur-md border border-blue-400/30 p-8 rounded-2xl shadow-xl"
              >
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-400/20 p-3 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-white mb-2">SA Data Protection Compliance</h3>
                    <p className="text-white/80 leading-relaxed">
                      Our infrastructure is architected to exceed South African regulatory standards, strictly 
                      adhering to the <strong>POPI Act</strong> (Protection of Personal Information) and 
                      <strong>PAIA</strong> (Promotion of Access to Information Act) to ensure clinical data 
                      sovereignty and patient PII security.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Pricing Breakdown Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-5"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                   <TrendingUp className="h-6 w-6 text-cyan-400 opacity-50 transition-opacity group-hover:opacity-100" />
                </div>
                
                <CardHeader className="pt-10 text-center pb-6 border-b border-white/10">
                  <CardTitle className="text-3xl font-headline font-bold mb-2">Scalable Infrastructure</CardTitle>
                  <CardDescription className="text-white/80 text-lg">
                    Pay for exactly what your organization needs.
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-8 px-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-lg">Base Platform Fee</span>
                    </div>
                    <span className="text-2xl font-bold">R500 / mo</span>
                  </div>

                  <div className="w-full h-px bg-white/10" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-white/90">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm">Additional Practice</span>
                      </div>
                      <span className="font-bold">+R250</span>
                    </div>
                    <div className="flex items-center justify-between text-white/90">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm">Additional Clinician</span>
                      </div>
                      <span className="font-bold">+R100</span>
                    </div>
                    <div className="flex items-center justify-between text-white/90">
                      <div className="flex items-center gap-3">
                        <UserCog className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm">Additional Admin</span>
                      </div>
                      <span className="font-bold">+R50</span>
                    </div>
                    <div className="flex items-center justify-between text-white/90">
                      <div className="flex items-center gap-3">
                        <Code2 className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm">API Access & Webhooks</span>
                      </div>
                      <span className="font-bold">+R150</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 italic pt-4">
                    *Base fee includes 1 Practice, 1 Admin, and 2 Clinicians seats.
                  </p>
                </CardContent>

                <CardFooter className="pb-10 pt-4">
                  <Button 
                    className="w-full h-14 text-lg font-bold bg-white text-blue-900 hover:bg-blue-50 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    asChild
                  >
                    <Link href="/contact">Get Started with Business Clinic</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-3xl text-center md:text-left md:flex items-center justify-between gap-10"
            >
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-headline font-bold text-white mb-3 flex items-center gap-3 justify-center md:justify-start">
                  <span className="bg-primary/20 text-primary p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  Security, Privacy & Compliance (POPIA)
                </h3>
                <p className="text-white/70 text-lg max-w-3xl">
                  Raising Atlantic acts as a secure, immutable ledger for clinical data. We are fully POPIA compliant, 
                  utilizing bank-grade encryption to protect PII and ensuring that sensitive medical history 
                  remains confidential and audit-ready.
                </p>
              </div>
              <div className="shrink-0 bg-white/5 p-8 rounded-2xl border border-white/10">
                <div className="text-white font-bold text-center">
                  <div className="text-4xl mb-1 tabular-nums">100%</div>
                  <div className="text-sm opacity-60 uppercase tracking-widest">Encrypted Data</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedGradientBackground>
    </section>
  );
}
