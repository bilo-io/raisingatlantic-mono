export type Tokens = {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  popover: string;
  popoverForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  primary: string;
  primaryForeground: string;
  primaryGradientFrom: string;
  primaryGradientTo: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  ring: string;
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarBorder: string;
};

export const lightTokens: Tokens = {
  background: "#F3F1E9",
  foreground: "#1A1915",
  muted: "#E5E2DA",
  mutedForeground: "#73716A",
  popover: "#FCFAF6",
  popoverForeground: "#1A1915",
  card: "#FCFAF6",
  cardForeground: "#1A1915",
  border: "#DCD9D1",
  input: "#DCD9D1",
  primary: "#D97757",
  primaryForeground: "#FFFFFF",
  primaryGradientFrom: "#D97757",
  primaryGradientTo: "#B85F41",
  secondary: "#EAE7DF",
  secondaryForeground: "#1A1915",
  accent: "#E5E2DA",
  accentForeground: "#1A1915",
  destructive: "#EF4444",
  destructiveForeground: "#FAFAFA",
  ring: "#D97757",
  sidebarBackground: "#EAE7DF",
  sidebarForeground: "#1A1915",
  sidebarPrimary: "#D97757",
  sidebarBorder: "#DCD9D1",
};

export const darkTokens: Tokens = {
  background: "#1F1D1B",
  foreground: "#F3F1E9",
  muted: "#2A2825",
  mutedForeground: "#9A958A",
  popover: "#262421",
  popoverForeground: "#F3F1E9",
  card: "#262421",
  cardForeground: "#F3F1E9",
  border: "#383530",
  input: "#383530",
  primary: "#E2896D",
  primaryForeground: "#1F1D1B",
  primaryGradientFrom: "#E2896D",
  primaryGradientTo: "#D97757",
  secondary: "#33302B",
  secondaryForeground: "#F3F1E9",
  accent: "#2A2825",
  accentForeground: "#F3F1E9",
  destructive: "#EF4444",
  destructiveForeground: "#FAFAFA",
  ring: "#E2896D",
  sidebarBackground: "#2A2825",
  sidebarForeground: "#F3F1E9",
  sidebarPrimary: "#E2896D",
  sidebarBorder: "#383530",
};

const toCssVarName = (key: string) =>
  "--" + key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

export const tokensToVars = (tokens: Tokens): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tokens)) {
    out[toCssVarName(k)] = v;
  }
  return out;
};
