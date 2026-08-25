
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/constants';
import { SiteLogo } from './SiteLogo';
import { useFooterLinks } from './footer-links';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();
  const { companyLinks, resourceLinks, legalLinks, socialLinks } = useFooterLinks();

  return (
    // Hidden on mobile — these links live at the bottom of the hamburger menu instead (see LandingHeader).
    <footer className="hidden md:block border-t bg-background">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Left Column: Logo and Social */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <SiteLogo />
            </Link>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" 
                      className="text-muted-foreground hover-gradient-text transition-all"
                      aria-label={social.label}>
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Center Column 1: Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-muted-foreground hover-gradient-text transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Column 2: Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-muted-foreground hover-gradient-text transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Column: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-muted-foreground hover-gradient-text transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
