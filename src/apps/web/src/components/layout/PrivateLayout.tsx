
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Bell, LogOut, Menu, Settings, UserCircle, User, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { UserRole, type NavLinkItem, DASHBOARD_NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { DUMMY_DEFAULT_USER_ID, dummyUsers, type User as UserType } from '@/data/users';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BreadcrumbNav } from './BreadcrumbNav';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '../ui/skeleton';
import { RoleAvatar } from '@/components/ui/RoleAvatar';
import { SiteLogo } from './SiteLogo';

interface NavItemProps {
  link: NavLinkItem;
  pathname: string;
  isMobile?: boolean;
  onNavigate?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ link, pathname, isMobile, onNavigate }) => {
  const router = useRouter();

  const isParentActive = () => {
    if (pathname === link.href) return true; 
    if (link.children && link.children.length > 0) {
      return link.children.some(child => pathname.startsWith(child.href));
    }
    if (link.href === '/dashboard') return pathname === '/dashboard' || pathname === '/dashboard/';
    return pathname.startsWith(link.href);
  };
  const active = isParentActive();

  if (link.children && link.children.length > 0) {
    const isChildActive = link.children.some(child => pathname.startsWith(child.href));
    const defaultAccordionValue = (isChildActive || pathname === link.href) ? link.label : undefined;

    return (
      <Accordion type="single" collapsible className="w-full" defaultValue={defaultAccordionValue}>
        <AccordionItem value={link.label} className="border-none">
          <div className={cn(
            "flex items-center justify-between rounded-lg px-3 transition-all",
            active 
              ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
              : "text-muted-foreground hover:text-primary hover:bg-sidebar-accent"
          )}>
            <div
              className="flex items-center gap-3 py-2 flex-1 cursor-pointer"
              onClick={() => {
                if (link.href && link.href !== "#") {
                  router.push(link.href);
                  if (isMobile && onNavigate) {
                    onNavigate();
                  }
                }
              }}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </div>
            <AccordionTrigger
              className="p-2 -mr-2 hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
              onClick={(e) => e.stopPropagation()} // Stop propagation to prevent navigation
            />
          </div>
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
      onClick={() => {
        if (onNavigate) onNavigate();
      }}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        active 
          ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
          : "text-muted-foreground hover:text-primary hover:bg-sidebar-accent"
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
        <NavItem key={link.href} link={link} pathname={pathname} onNavigate={onNavigate} isMobile={!!onNavigate}/>
      ))}
    </nav>
  );
}

export function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | undefined>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      const storedUserId = localStorage.getItem('currentUserId');
      const user = dummyUsers.find(u => u.id === storedUserId) || dummyUsers.find(u => u.id === DUMMY_DEFAULT_USER_ID);
      
      if (user) {
        setCurrentUser(user);
        if (!storedUserId) {
          localStorage.setItem('currentUserId', user.id);
        }
      } else {
        router.push('/login');
      }
    }
  }, [router]);
  

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUserId');
    }
    router.push('/login');
  };

  if (!mounted || !currentUser) {
    return (
        <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-sidebar md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="flex-1 overflow-auto py-2 px-4 space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                    <div className="mt-auto p-4 border-t">
                        <Skeleton className="h-8 w-full" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col overflow-hidden">
                <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Skeleton className="h-8 w-32" />
                    <div className="ml-auto flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
                    <Skeleton className="h-64 w-full" />
                </main>
            </div>
        </div>
    );
  }


  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <SiteLogo />
            </Link>
            <Badge variant="outline" className="text-xs">
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </Badge>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarNavContent currentUserRole={currentUser.role} onNavigate={() => setIsSheetOpen(false)} />
          </div>
        </div>
      </div>
      <div className="flex flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <SheetContent side="left" className="flex flex-col bg-sidebar p-0" showDefaultCloseButton={false}>
              <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
                 <div className="flex items-center gap-3">
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2">
                          <X className="h-5 w-5" />
                          <span className="sr-only">Close menu</span>
                      </Button>
                    </SheetClose>
                    <Link href="/dashboard" className="flex items-center" onClick={() => setIsSheetOpen(false)}>
                      <SiteLogo />
                    </Link>
                 </div>
                 <Badge variant="outline" className="text-xs">
                    {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  </Badge>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <SidebarNavContent currentUserRole={currentUser.role} onNavigate={() => setIsSheetOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <BreadcrumbNav navLinks={DASHBOARD_NAV_LINKS} />

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
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
                   <RoleAvatar
                      src={currentUser.imageUrl}
                      name={currentUser.name}
                      role={currentUser.role}
                      avatarClassName="h-9 w-9"
                      iconContainerClassName="h-5 w-5 border-2"
                      iconClassName="h-3 w-3"
                    />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{(currentUser.title ? currentUser.title + ' ' : '') + currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground/80 pt-1">
                      Role: <span className="font-medium text-foreground">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</span>
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account/settings">
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
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
          <div className="flex flex-col gap-4 lg:gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
