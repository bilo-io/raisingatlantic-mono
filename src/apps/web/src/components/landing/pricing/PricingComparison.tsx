"use client";

import React from 'react';
import { Check, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const comparisonData = [
  {
    category: "Care Network & Users",
    features: [
      { name: "Max Child Profiles", free: "1", medium: "3", high: "Unlimited", clinic: "Unlimited" },
      { name: "Parent Logins", free: "Yes", medium: "Yes", high: "Yes", clinic: "Yes" },
      { name: "Caregiver Access (Nannies, etc.)", free: "No", medium: "Yes", high: "Yes", clinic: "Yes" },
      { name: "Direct Clinician Sharing", free: "No", medium: "Yes", high: "Yes", clinic: "Yes" },
      { name: "Multi-Practice Branches", free: "No", medium: "No", high: "No", clinic: "Unlimited" },
      { name: "Clinician Logins", free: "No", medium: "No", high: "No", clinic: "Unlimited" },
    ]
  },
  {
    category: "Health & Clinical Data",
    features: [
      { name: "Growth Velocity Tracking", free: "Basic", medium: "Advanced", high: "Advanced+", clinic: "Practice-Wide" },
      { name: "EPI Vaccination Schedule", free: "Standard", medium: "Custom Alerts", high: "Custom + Private Clinics", clinic: "Enterprise Custom" },
      { name: "Allergy & Diet Tracking", free: "No", medium: "Basic", high: "Comprehensive", clinic: "Comprehensive" },
      { name: "Medical History Archiving", free: "3 Years", medium: "Unlimited", high: "Unlimited", clinic: "Unlimited" },
    ]
  },
  {
    category: "Reports & Support",
    features: [
      { name: "Crèche Admission PDF Reports", free: "No", medium: "Standard", high: "Detailed", clinic: "White-labeled" },
      { name: "Priority Clinician Messaging", free: "No", medium: "No", high: "Yes", clinic: "Yes" },
      { name: "Direct App Support", free: "Community", medium: "Standard", high: "Priority Phone", clinic: "Dedicated Account Manager" },
      { name: "Data Export", free: "Manual", medium: "CSV Download", high: "Full Archive Link", clinic: "API Access" },
    ]
  }
];

export function PricingComparison() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">Feature Comparison</h2>
          <p className="text-muted-foreground text-lg">
            A granular breakdown of capabilities across our service tiers.
          </p>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px] text-lg font-bold py-6 px-8">Feature</TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Badge variant="outline" className="border-primary text-primary px-3 py-1">Starter</Badge>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">Pro</Badge>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Badge className="bg-white text-gray-900 px-3 py-1 ring-1 ring-gray-200">Premium</Badge>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Badge className="bg-slate-900 text-white px-3 py-1">Clinic</Badge>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((section) => (
                <React.Fragment key={section.category}>
                  <TableRow className="bg-muted/50 border-none hover:bg-muted/50">
                    <TableCell colSpan={5} className="py-4 px-8 font-bold text-lg text-primary uppercase tracking-wider">
                      {section.category}
                    </TableCell>
                  </TableRow>
                  {section.features.map((feature) => (
                    <TableRow key={feature.name} className="hover:bg-muted transition-colors border-border/50">
                      <TableCell className="py-4 px-8 font-medium">{feature.name}</TableCell>
                      <TableCell className="text-center py-4">
                        {renderValue(feature.free)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderValue(feature.medium)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderValue(feature.high)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderValue(feature.clinic)}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

function renderValue(value: string) {
  if (value === "Yes") {
    return <Check className="h-6 w-6 text-green-500 mx-auto" />;
  }
  if (value === "No") {
    return <Minus className="h-6 w-6 text-muted-foreground mx-auto" />;
  }
  return <span className="text-sm font-semibold">{value}</span>;
}
