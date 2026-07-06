'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import type { StylesConfig } from 'react-select';
import { Nav } from '@/components/landing/Nav';
import { HeroSection } from '@/components/landing/HeroSection';
import {
  DEFAULT_FONT_IDS,
  FONT_CATALOG,
  FONT_CATEGORY_LABELS,
  FONT_SLOTS,
  FONT_SLOT_LABELS,
  FONT_STORAGE_KEY,
  fontStack,
  getFont,
  type FontCategory,
  type FontSlot,
} from '@/lib/font-catalog';

interface FontChoice {
  value: string;
  label: string;
  stack: string;
}

const SLOT_HINTS: Record<FontSlot, string> = {
  headline: 'Hero display text and section titles',
  wordmark: 'The “PediCheck” logo text',
  body: 'Paragraphs, buttons and UI text',
};

const GROUPED_OPTIONS = (['serif', 'sans', 'rounded'] as FontCategory[]).map(
  (category) => ({
    label: FONT_CATEGORY_LABELS[category],
    options: FONT_CATALOG.filter((f) => f.category === category).map((f) => ({
      value: f.id,
      label: f.label,
      stack: fontStack(f),
    })),
  }),
);

const ALL_CHOICES = GROUPED_OPTIONS.flatMap((g) => g.options);

const selectStyles: StylesConfig<FontChoice, false> = {
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    borderColor: state.isFocused ? 'var(--ocean)' : 'var(--line-strong)',
    background: '#fffdf9',
    minHeight: 46,
    boxShadow: 'none',
    ':hover': { borderColor: 'var(--ocean)' },
  }),
  option: (base, state) => ({
    ...base,
    fontFamily: state.data.stack,
    fontSize: 15,
    color: 'var(--ink)',
    background: state.isSelected
      ? 'var(--warm-grey)'
      : state.isFocused
        ? 'var(--cream)'
        : '#fff',
    ':active': { background: 'var(--warm-grey)' },
  }),
  singleValue: (base, state) => ({
    ...base,
    fontFamily: state.data.stack,
    color: 'var(--ink)',
  }),
  menu: (base) => ({ ...base, zIndex: 100, borderRadius: 12, overflow: 'hidden' }),
  groupHeading: (base) => ({
    ...base,
    color: 'var(--ink-muted)',
    letterSpacing: '0.14em',
  }),
};

function applyFont(slot: FontSlot, stack: string) {
  document.documentElement.style.setProperty(`--${slot}-font`, stack);
}

function clearFont(slot: FontSlot) {
  document.documentElement.style.removeProperty(`--${slot}-font`);
}

function persist(selection: Record<FontSlot, string>) {
  const payload = Object.fromEntries(
    FONT_SLOTS.map((slot) => {
      const font = getFont(selection[slot]);
      return [slot, font ? { id: font.id, stack: fontStack(font) } : undefined];
    }),
  );
  localStorage.setItem(FONT_STORAGE_KEY, JSON.stringify(payload));
}

export function FontSettings() {
  const [selection, setSelection] =
    useState<Record<FontSlot, string>>(DEFAULT_FONT_IDS);

  // The saved selection lives in localStorage (already applied pre-paint by
  // the layout script) — sync the dropdowns to it after mount.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FONT_STORAGE_KEY) ?? 'null');
      if (!saved) return;
      setSelection((prev) => {
        const next = { ...prev };
        for (const slot of FONT_SLOTS) {
          const font = getFont(saved[slot]?.id);
          if (font) next[slot] = font.id;
        }
        return next;
      });
    } catch {
      // Corrupt saved state — leave the defaults in place.
    }
  }, []);

  const handleChange = (slot: FontSlot, choice: FontChoice | null) => {
    if (!choice) return;
    const next = { ...selection, [slot]: choice.value };
    setSelection(next);
    applyFont(slot, choice.stack);
    persist(next);
  };

  const handleReset = () => {
    setSelection(DEFAULT_FONT_IDS);
    FONT_SLOTS.forEach(clearFont);
    localStorage.removeItem(FONT_STORAGE_KEY);
  };

  const isDefault = FONT_SLOTS.every(
    (slot) => selection[slot] === DEFAULT_FONT_IDS[slot],
  );

  return (
    <main className="settings-page">
      <div className="wrap">
        <a href="/" className="nav-link">
          ← Back to site
        </a>
        <h1 className="display settings-title">Font settings</h1>
        <p className="sub settings-intro">
          Try different Google Fonts for the three typography roles. Choices are
          saved in this browser and apply across the whole site until you reset
          them.
        </p>

        <div className="settings-controls">
          {FONT_SLOTS.map((slot) => (
            <div className="settings-field" key={slot}>
              <label className="settings-label" htmlFor={`font-${slot}`}>
                {FONT_SLOT_LABELS[slot]}
                {selection[slot] === DEFAULT_FONT_IDS[slot] && (
                  <span className="settings-default-badge">default</span>
                )}
              </label>
              <p className="settings-hint">{SLOT_HINTS[slot]}</p>
              <Select<FontChoice>
                inputId={`font-${slot}`}
                instanceId={`font-${slot}`}
                options={GROUPED_OPTIONS}
                value={ALL_CHOICES.find((c) => c.value === selection[slot]) ?? null}
                onChange={(choice) => handleChange(slot, choice)}
                styles={selectStyles}
                placeholder="Search Google Fonts…"
                isSearchable
              />
            </div>
          ))}
        </div>

        <div className="settings-actions">
          <button
            type="button"
            className="btn"
            onClick={handleReset}
            disabled={isDefault}
          >
            Reset to defaults
          </button>
        </div>

        <div className="eyebrow">Preview</div>
        <div className="settings-preview" aria-hidden="true">
          <div className="settings-preview-inner">
            <Nav />
            <HeroSection />
          </div>
        </div>
      </div>
    </main>
  );
}
