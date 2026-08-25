
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Construction } from 'lucide-react';
import { LANDING_NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import type { NavLinkItem } from '@/lib/constants';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { SiteLogo } from './SiteLogo';
import { useFooterLinks } from './footer-links';

function AuthButton({ link }: { link: NavLinkItem }) {
    const { t } = useTranslation();
    const ButtonIcon = link.icon;

    return (
        <Button asChild variant={link.href === '/signup' ? 'default' : 'outline'}>
            <Link href={link.href}>
                <ButtonIcon className="mr-2 h-4 w-4" />
                {t(link.label)}
            </Link>
        </Button>
    );
}

export function LandingHeader() {
  const { t } = useTranslation();
  const { companyLinks, resourceLinks, legalLinks, socialLinks } = useFooterLinks();
  const currentYear = new Date().getFullYear();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <SiteLogo />
        </Link>
        
        {/* Desktop: Centered Nav and Right Controls */}
        <div className="hidden md:flex flex-1 items-center">
          {/* Centered Nav Links */}
          <nav className="flex-1 flex justify-center items-center space-x-6 text-sm font-medium">
            {LANDING_NAV_LINKS.filter(link => !link.isAuthLink).map((link: NavLinkItem) => (
              <Link
                key={link.label} // link.label is a translation key
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          {/* Right Aligned Controls (Lang, Theme, Auth) */}
          <div className="flex items-center space-x-2">
            <span className="hover-gradient-text"><LanguageSwitcher /></span>
            <span className="hover-gradient-text"><ThemeToggleButton /></span>
            {LANDING_NAV_LINKS.filter(link => link.isAuthLink).map((link: NavLinkItem) => (
               <Button key={link.label} asChild variant={link.href === '/signup' ? 'default' : 'outline'} className={link.href === '/signup' ? '' : 'hover-gradient-border transition-all'}>
                  <Link href={link.href}>
                      <link.icon className="mr-2 h-4 w-4" />
                      {t(link.label)}
                  </Link>
               </Button>
            ))}
          </div>
        </div>

        {/* Mobile: Controls (Lang, Theme, Menu) - this group is pushed to the far right on mobile */}
        <div className="flex items-center space-x-2 md:hidden ml-auto"> 
          <span className="hover-gradient-text"><LanguageSwitcher /></span>
          <span className="hover-gradient-text"><ThemeToggleButton /></span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col overflow-y-auto">
              <nav className="flex flex-col space-y-4 mt-8">
                {LANDING_NAV_LINKS.map((link: NavLinkItem) => {
                  if (link.isAuthLink) {
                    return <AuthButton key={link.label} link={link} />;
                  }
                  return (
                    <Link
                        key={link.label} // link.label is a translation key
                        href={link.href}
                        className="transition-colors hover:text-foreground/80 text-foreground/60 py-2 text-lg"
                    >
                        <link.icon className="inline-block mr-2 h-5 w-5" />
                        {t(link.label)}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer links — surfaced here on mobile since the page footer is hidden below md. */}
              <div className="mt-auto border-t pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-3">Company</h3>
                    <ul className="space-y-2">
                      {companyLinks.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="text-sm text-muted-foreground hover-gradient-text transition-all">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-3">Resources</h3>
                    <ul className="space-y-2">
                      {resourceLinks.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="text-sm text-muted-foreground hover-gradient-text transition-all">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-3">Legal</h3>
                    <ul className="space-y-2">
                      {legalLinks.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="text-sm text-muted-foreground hover-gradient-text transition-all">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  {socialLinks.map((social) => (
                    <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                          className="text-muted-foreground hover-gradient-text transition-all"
                          aria-label={social.label}>
                      <social.icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>

                <p className="mt-6 text-xs text-muted-foreground">
                  &copy; {currentYear} {SITE_NAME}. All rights reserved.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
