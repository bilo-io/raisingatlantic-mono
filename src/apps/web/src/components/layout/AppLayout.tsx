
"use client";

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, ChevronDown, Home, LogOut, Menu, Search, Settings, UserCircle, Users, Zap } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DUMMY_CURRENT_USER_ROLE, SITE_NAME, UserRole, type NavLinkItem, DASHBOARD_NAV_LINKS } from '@/lib/constants';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface NavItemProps {
  link: NavLinkItem;
  pathname: string;
  isMobile?: boolean;
  onNavigate?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ link, pathname, isMobile, onNavigate }) => {
  const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
  
  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  if (link.children && link.children.length > 0) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={link.label} className="border-none">
          <AccordionTrigger 
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent [&[data-state=open]>svg:last-child]:rotate-180",
              isActive && "bg-sidebar-accent text-primary font-semibold"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </AccordionTrigger>
          <AccordionContent className="pl-4 pt-1 pb-0">
            <nav className="flex flex-col gap-1">
              {link.children.map(childLink => (
                <NavItem key={childLink.href} link={childLink} pathname={pathname} isMobile={isMobile} onNavigate={onNavigate} />
              ))}
            </nav>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <Link
      href={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent",
        isActive && "bg-sidebar-accent text-primary font-semibold"
      )}
    >
      <link.icon className="h-4 w-4" />
      {link.label}
    </Link>
  );
};


function SidebarNavContent({ currentUserRole, onNavigate }: { currentUserRole: UserRole, onNavigate?: () => void }) {
  const pathname = usePathname();

  const filteredNavLinks = DASHBOARD_NAV_LINKS.filter(link => {
    if (!link.roles) return true; 
    return link.roles.includes(currentUserRole);
  });
  
  return (
    <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
      {filteredNavLinks.map((link) => (
        <NavItem key={link.href} link={link} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(DUMMY_CURRENT_USER_ROLE);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      const storedRole = localStorage.getItem('currentUserRole') as UserRole;
      if (storedRole && Object.values(UserRole).includes(storedRole)) {
        setCurrentUserRole(storedRole);
      } else {
        // If no role or invalid role, set to default and update localStorage
        setCurrentUserRole(DUMMY_CURRENT_USER_ROLE);
        if (typeof window.localStorage.setItem === 'function') {
            localStorage.setItem('currentUserRole', DUMMY_CURRENT_USER_ROLE);
        }
      }
    }
  }, []);

  const DUMMY_USER = {
    name: "Current User",
    email: "user@example.com",
    imageUrl: "https://placehold.co/100x100.png",
    role: currentUserRole, 
  };
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUserRole');
    }
    setCurrentUserRole(DUMMY_CURRENT_USER_ROLE); // Reset to default parent role
    router.push('/login');
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
              <Zap className="h-6 w-6 text-primary" />
              <span className="">{SITE_NAME}</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarNavContent currentUserRole={DUMMY_USER.role} />
          </div>
          <div className="mt-auto p-4 border-t">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-muted/10">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar p-0">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline" onClick={() => setIsSheetOpen(false)}>
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="">{SITE_NAME}</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <SidebarNavContent currentUserRole={DUMMY_USER.role} onNavigate={() => setIsSheetOpen(false)} />
              </div>
              <div className="mt-auto p-4 border-t">
                 <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1">
            {/* Can add search bar here if needed in future */}
          </div>

          <ThemeToggleButton />

          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={DUMMY_USER.imageUrl} alt={DUMMY_USER.name} />
                  <AvatarFallback>{DUMMY_USER.name.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60"> {/* Increased width slightly */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{DUMMY_USER.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {DUMMY_USER.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground/80 pt-1">
                    Role: <span className="font-medium text-foreground">{DUMMY_USER.role.charAt(0).toUpperCase() + DUMMY_USER.role.slice(1)}</span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

// Placeholder LanguageSwitcher - actual implementation requires i18n library
function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = React.useState("English");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {currentLang}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setCurrentLang("English")}>English</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setCurrentLang("Español")}>Español</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setCurrentLang("Français")}>Français</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

