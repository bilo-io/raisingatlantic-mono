
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // Assuming these are standard ShadCN components
import type { NavLinkItem } from '@/lib/constants';
import { Home } from 'lucide-react';

interface BreadcrumbNavItem {
  href?: string;
  label: string;
}

interface BreadcrumbNavProps {
  navLinks: NavLinkItem[];
  homeHref?: string;
  homeLabel?: string;
}

// Helper function to generate breadcrumbs
function generateBreadcrumbs(pathname: string, navLinks: NavLinkItem[], homeHref: string, homeLabel: string): BreadcrumbNavItem[] {
  const breadcrumbs: BreadcrumbNavItem[] = [{ href: homeHref, label: homeLabel }];

  if (pathname === homeHref || pathname === `${homeHref}/`) {
    return breadcrumbs;
  }

  const pathSegments = pathname.replace(homeHref, '').split('/').filter(segment => segment);
  let currentPath = homeHref;
  let currentSearchSpace: NavLinkItem[] | undefined = navLinks;

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    const potentialNextPath = `${currentPath === '/' && homeHref === '/' ? '' : currentPath}/${segment}`;
    
    let foundLink: NavLinkItem | undefined = undefined;
    if (currentSearchSpace) {
        foundLink = currentSearchSpace.find(link => {
            // Check for exact match or if the link is a parent of the current segment path
            // e.g. link.href = /dashboard/children, potentialNextPath = /dashboard/children/some-id
            return link.href === potentialNextPath || potentialNextPath.startsWith(link.href + '/');
        });
        // If an exact match is found for a parent, use it.
        // If potentialNextPath is /dashboard/children/ID and foundLink.href is /dashboard/children
        // we need to handle the ID segment in the else block if no more specific child link matches the full path.
         if (foundLink && foundLink.href !== potentialNextPath && !potentialNextPath.startsWith(foundLink.href + '/')) {
            // This condition handles cases where a partial match isn't a true parent, reset foundLink.
            // This is to prevent /dashboard/children from matching /dashboard/children-something-else incorrectly.
            // A more robust way is to ensure segment-by-segment matching.
            // For now, if href is not exact, but startsWith, it's considered a parent for traversal.
            // If the full potentialNextPath is not the link.href, it means 'segment' is a sub-part.
        }


         // If a link matches the current segment's path exactly
        const exactMatch = currentSearchSpace.find(link => link.href === potentialNextPath);
        if (exactMatch) {
            foundLink = exactMatch;
        }

    }


    if (foundLink && foundLink.href === potentialNextPath) {
      breadcrumbs.push({ href: foundLink.href, label: foundLink.label });
      currentPath = foundLink.href;
      currentSearchSpace = foundLink.children;
    } else {
      // Handle dynamic segments or leaf pages not in navLinks' children explicitly with this exact path
      let label = segment.charAt(0).toUpperCase() + segment.slice(1); // Default: capitalize

      const prevBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      const prevLabel = prevBreadcrumb?.label.toLowerCase();

      if (segment === "edit") {
        label = "Edit";
      } else if (segment === "new") {
        label = "New";
      } else if (prevLabel && (prevLabel.includes("children") || prevLabel.includes("patients") || prevLabel.includes("profile"))) {
        // If previous was a list or a profile, this dynamic segment is likely a specific item's view or sub-action
        if (pathSegments[i+1] === 'edit' && i < pathSegments.length -1) { // Current segment is an ID, next is 'edit'
            label = "Profile";
        } else if (!isNaN(Number(segment)) || segment.length > 20) { // Crude check for ID (numeric or long string like UUID)
             label = "Details"; // Could be "Profile", "Details", etc.
        }
      }
      
      breadcrumbs.push({ href: potentialNextPath, label });
      currentPath = potentialNextPath;
      currentSearchSpace = []; // Stop searching deeper in nav structure
    }
  }
  return breadcrumbs;
}

export function BreadcrumbNav({ navLinks, homeHref = "/dashboard", homeLabel = "Dashboard" }: BreadcrumbNavProps) {
  const pathname = usePathname();
  const items = React.useMemo(() => generateBreadcrumbs(pathname, navLinks, homeHref, homeLabel), [pathname, navLinks, homeHref, homeLabel]);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.label + index}>
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href || '#'}>{item.label === 'Dashboard' && index === 0 ? <Home className="h-4 w-4" /> : item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
