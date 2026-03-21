"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

interface SiteLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function SiteLogo({ width = 175, height = 40, className }: SiteLogoProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/assets/images/app-logo-light.svg"
        alt={SITE_NAME}
        width={width}
        height={height}
        className="dark:hidden"
        priority
      />
      <Image
        src="/assets/images/app-logo-dark.svg"
        alt={SITE_NAME}
        width={width}
        height={height}
        className="hidden dark:block"
        priority
      />
    </div>
  );
}
