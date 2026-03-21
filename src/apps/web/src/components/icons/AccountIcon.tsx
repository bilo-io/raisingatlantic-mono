// src/components/icons/AccountIcon.tsx
import type { LucideProps } from 'lucide-react';
import React from 'react';

export function AccountIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* User part */}
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      {/* Cog part - simplified and positioned */}
      <path d="M18.67 17.57a2 2 0 1 0 2.83 2.83" />
      <path d="M18.67 17.57a2 2 0 1 0 2.83-2.83l-1.42-1.41" />
      <path d="M15.17 21.07a2 2 0 1 0-2.83 2.83" />
       {/* Small cog overlapping user shoulder/area */}
      <circle cx="17.5" cy="16.5" r="1.5" />
      <path d="M17.5 15v-1" />
      <path d="M17.5 19v-1" />
      <path d="m16.43 15.43-.71-.71" />
      <path d="m18.57 17.57.71.71" />
      <path d="m19.24 15.43.71-.71" />
      <path d="m16.43 17.57-.71.71" />

    </svg>
  );
}
