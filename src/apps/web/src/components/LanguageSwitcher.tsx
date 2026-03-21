
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
import { Languages } from "lucide-react";

interface LanguageOption {
  code: string;
  nameKey: string; 
  shortCodeKey: string; 
}

const languages: LanguageOption[] = [
  { code: "en", nameKey: "language", shortCodeKey: "languageCode" },
  { code: "af", nameKey: "language", shortCodeKey: "languageCode" },
  { code: "de", nameKey: "language", shortCodeKey: "languageCode" },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

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
          >
            {i18n.exists(`${lang.nameKey}`, {lng: lang.code}) ? i18n.t(`${lang.nameKey}`, {lng: lang.code}) : lang.code.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
