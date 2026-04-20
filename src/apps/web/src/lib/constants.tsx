
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, Baby, Settings, ShieldCheck, MessageCircleQuestion, Sparkles, FileText, UserPlus, LogIn, Briefcase, PlusCircle, UserCircle as UserCircleIcon, MapPin, ClipboardList, TrendingUp, Award, Syringe, User, UserCheck, FileCheck, Shield, Stethoscope, Info, Mail, Search, Newspaper, Building, Palette, Gem, Fingerprint, Tag } from 'lucide-react';

export enum UserRole {
  PARENT = 'parent',
  CLINICIAN = 'clinician',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export type NavLinkItem = {
  href: string;
  label: string; // Will now be a translation key
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  roles?: UserRole[];
  children?: NavLinkItem[];
  isPublic?: boolean;
  isAuthLink?: boolean;
};

export const SITE_NAME = "Raising Atlantic";

export const LANDING_NAV_LINKS: NavLinkItem[] = [
  { href: '/about', label: 'navAbout', icon: Info, isPublic: true },
  { href: '/contact', label: 'navContact', icon: Mail, isPublic: true },
  { href: '/directory', label: 'navDirectory', icon: Search, isPublic: true },
  { href: '/pricing', label: 'navPricing', icon: Tag, isPublic: true },
  { href: '/blog', label: 'navBlogLink', icon: Newspaper, isPublic: true },
  { href: '/login', label: 'navLogin', icon: LogIn, isAuthLink: true, isPublic: true },
  { href: '/login/test', label: 'navLoginTest', icon: Fingerprint, isAuthLink: true, isPublic: true },
  { href: '/signup', label: 'navSignUp', icon: UserPlus, isAuthLink: true, isPublic: true },
];

export const DASHBOARD_NAV_LINKS: NavLinkItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/dashboard/children',
    label: 'Children',
    icon: Baby,
    roles: [UserRole.PARENT],
    children: [
      { href: '/dashboard/children', label: 'All Children', icon: Users },
      { href: '/dashboard/children/new', label: 'Add New Child', icon: PlusCircle },
    ]
  },
  {
    href: '/dashboard/patients',
    label: 'Patients',
    icon: Users,
    roles: [UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    href: '/dashboard/tenants',
    label: 'Tenants',
    icon: Building,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    href: '/dashboard/directory',
    label: 'Directory',
    icon: Search,
    roles: [UserRole.PARENT, UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      { 
        href: '/dashboard/directory/practices', 
        label: 'Practices', 
        icon: MapPin, 
      }, 
      { 
        href: '/dashboard/directory/clinicians', 
        label: 'Clinicians', 
        icon: Stethoscope, 
        roles: [UserRole.PARENT, UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN] 
      },
    ]
  },
  {
    href: '/dashboard/records',
    label: 'Records',
    icon: ClipboardList,
    roles: [UserRole.PARENT, UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      { href: '/dashboard/records/growth', label: 'Growth', icon: TrendingUp, roles: [UserRole.PARENT, UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN] },
      { href: '/dashboard/records/milestones', label: 'Milestones', icon: Award, roles: [UserRole.PARENT, UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN] },
      { href: '/dashboard/records/vaccinations', label: 'Vaccinations', icon: Syringe, roles: [UserRole.PARENT, UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    ]
  },
  {
    href: '/dashboard/verifications',
    label: 'Verifications',
    icon: ShieldCheck,
    roles: [UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      { href: '/dashboard/verifications/clinicians', label: 'Clinicians', icon: UserCheck, roles: [UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN] },
      { href: '/dashboard/verifications/records', label: 'Records', icon: FileCheck, roles: [UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    ]
  },
  {
    href: '/dashboard/admin',
    label: 'Admin',
    icon: Shield,
    roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    children: [
      { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
      { href: '/dashboard/admin/blog', label: 'Blog Management', icon: Newspaper, roles: [UserRole.SUPER_ADMIN] },
      { href: '/dashboard/admin/system', label: 'System Settings', icon: Settings },
      { href: '/dashboard/admin/logs', label: 'System Logs', icon: ClipboardList },
    ]
  },
  {
    href: '/dashboard/account',
    label: 'Account',
    icon: User,
    children: [
      { href: '/dashboard/account/profile', label: 'Profile', icon: UserCircleIcon },
      { href: '/dashboard/account/settings', label: 'Settings', icon: Settings },
    ]
  },
];

export const ALL_USER_ROLES = [UserRole.PARENT, UserRole.CLINICIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN];
export const DUMMY_CURRENT_USER_ROLE: UserRole = UserRole.PARENT;
