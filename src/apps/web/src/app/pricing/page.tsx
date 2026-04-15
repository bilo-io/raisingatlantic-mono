import { PublicLayout } from "@/components/layout/PublicLayout";
import { PricingTiers } from "@/components/landing/pricing/PricingTiers";
import { PricingComparison } from "@/components/landing/pricing/PricingComparison";
import { PricingFAQ } from "@/components/landing/pricing/PricingFAQ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Affordable plans for parents and healthcare providers to track child development.",
};

export default function PricingPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col">
        {/* Simple Page Header */}
        <div className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6">Simple, Transparent Plans</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Supporting your child's growth and health journey with professional-grade tools for everyone.
            </p>
          </div>
        </div>

        <PricingTiers />
        <PricingComparison />
        <PricingFAQ />
      </div>
    </PublicLayout>
  );
}
