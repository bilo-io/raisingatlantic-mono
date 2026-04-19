
"use client";

import * as React from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageOption {
  code: string;
  label: string; 
}

const languages: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "af", label: "Afrikaans" },
  { code: "de", label: "Deutsch" },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const currentLanguage = i18n.language || 'en';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t('changeLanguageLabel') || "Change language"}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onSelect={() => changeLanguage(lang.code)}
            className={cn(
              "flex items-center justify-between gap-2 cursor-pointer",
              currentLanguage.startsWith(lang.code) && "bg-accent font-medium"
            )}
          >
            <span>{lang.label}</span>
            {currentLanguage.startsWith(lang.code) && (
              <Check className="h-4 w-4 opacity-70" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
