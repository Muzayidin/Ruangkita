
// app/admin/adminTheme.ts

const light = {
  // Sync with globals.css :root
  bg: "#ffffff", // --background
  bgSoft: "#f8fafc", // slightly darker than white
  surface: "rgba(255, 255, 255, 0.7)", // glass-effect
  surfaceHighlight: "#ffffff",
  border: "#e2e8f0", // slate-200
  borderSoft: "#f1f5f9",

  text: "#0f172a", // --foreground
  textSoft: "#334155", // slate-700
  textMuted: "#64748b", // --muted

  primary: "#5f8d4e", // --primary
  primaryHover: "#4c7a3d",
  danger: "#ea580c", // --accent (or custom danger)
  dangerHover: "#c2410c",
  warning: "#e2d1c3", // --secondary (using as warning/neutral for now to match palette, or custom)
  // actually warning usually assumes yellow/orange. Let's keep a distinct warning.
  // or use the global Accent for 'danger/action' and Secondary for 'soft'.

  shadowSoft: "0 4px 20px rgba(0, 0, 0, 0.05)",
  shadowCard: "0 4px 6px rgba(0, 0, 0, 0.02)",
};

const dark = {
  // Sync with globals.css .dark
  bg: "#0f172a", // --background
  bgSoft: "#1e293b", // --card-bg
  surface: "rgba(15, 23, 42, 0.7)",
  surfaceHighlight: "#1e293b",
  border: "#334155", // slate-700
  borderSoft: "#1e293b",

  text: "#f8fafc", // --foreground
  textSoft: "#cbd5e1", // slate-300
  textMuted: "#94a3b8", // --muted

  primary: "#8abf8a", // --primary (dark mode)
  primaryHover: "#5f8d4e",
  danger: "#f59e0b", // --accent (dark mode)
  dangerHover: "#d97706",
  warning: "#4b5563", // --secondary (dark mode)

  shadowSoft: "0 4px 20px rgba(0, 0, 0, 0.5)",
  shadowCard: "0 4px 6px rgba(0, 0, 0, 0.3)",
};

export const adminPalette = { light, dark };

// The proxy object that components use
export const adminTheme = {
  bg: "var(--adm-bg)",
  bgSoft: "var(--adm-bg-soft)",
  surface: "var(--adm-surface)",
  surfaceHighlight: "var(--adm-surface-highlight)",
  border: "var(--adm-border)",
  borderSoft: "var(--adm-border-soft)",
  text: "var(--adm-text)",
  textSoft: "var(--adm-text-soft)",
  textMuted: "var(--adm-text-muted)",
  primary: "var(--adm-primary)",
  primaryHover: "var(--adm-primary-hover)",
  danger: "var(--adm-danger)",
  dangerHover: "var(--adm-danger-hover)",
  warning: "var(--adm-warning)",
  shadowSoft: "var(--adm-shadow-soft)",
  shadowCard: "var(--adm-shadow-card)",

  // Constants
  radiusLg: 24,
  radiusMd: 16,
};
