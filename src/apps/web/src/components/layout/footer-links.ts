"use client";

import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterSocialLink extends FooterLink {
  icon: LucideIcon;
}

export interface FooterLinkGroups {
  companyLinks: FooterLink[];
  resourceLinks: FooterLink[];
  legalLinks: FooterLink[];
  socialLinks: FooterSocialLink[];
}

/**
 * Single source of truth for the marketing footer link groups.
 * Consumed by both the desktop footer (LandingFooter) and the mobile
 * hamburger menu (LandingHeader), so the two never drift.
 */
export function useFooterLinks(): FooterLinkGroups {
  const { t } = useTranslation();

  return {
    companyLinks: [
      { href: "/about", label: t('navAbout') },
      { href: "/contact", label: t('navContact') },
      { href: "/directory", label: t('navDirectory') },
    ],
    resourceLinks: [
      { href: "/pricing", label: t('navPricing') },
      { href: "/design-system/branding", label: "Design System" },
      { href: "/blog", label: "Blog" },
    ],
    legalLinks: [
      { href: "/legal/privacy-policy", label: "Privacy Policy" },
      { href: "/legal/terms-of-service", label: "Terms of Service" },
      { href: "/legal/eula", label: "EULA" },
    ],
    socialLinks: [
      { href: "https://facebook.com", label: "Facebook", icon: Facebook },
      { href: "https://twitter.com", label: "Twitter", icon: Twitter },
      { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
      { href: "https://www.instagram.com/atlantic_childrens_practice/?igshid=YmMyMTA2M2Y%3D", label: "Instagram", icon: Instagram },
    ],
  };
}
