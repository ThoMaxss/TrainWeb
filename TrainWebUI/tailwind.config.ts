// tailwind.config.ts - Tailwind v4 compatible
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colors are now defined in @theme in globals.css (Tailwind v4)
      // But we keep the mapping here for compatibility
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        card: "var(--color-card)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        "disabled-text": "var(--color-disabled-text)",
        border: "var(--color-border)",
        "disabled-bg": "var(--color-disabled-bg)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        destructive: "var(--color-destructive)",
        momo: "var(--color-momo)",
        info: "var(--color-info)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        "hover-primary": "var(--color-hover-primary)",
        "active-primary": "var(--color-active-primary)",
        "hover-accent": "var(--color-hover-accent)",
        "active-accent": "var(--color-active-accent)",
        "payment-momo": "var(--color-payment-momo)",
        "payment-momo-dark": "var(--color-payment-momo-dark)",
        "payment-bank": "var(--color-payment-bank)",
        "payment-bank-dark": "var(--color-payment-bank-dark)",
        "payment-transfer": "var(--color-payment-transfer)",
        "payment-transfer-dark": "var(--color-payment-transfer-dark)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08)",
      },
      borderRadius: { "2xl": "1.25rem" },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "Segoe UI", "Roboto", "Arial"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo"],
      },
      fontSize: {
        display: ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h2: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
        h3: ["1.25rem", { lineHeight: "1.35" }],
        body: ["1rem", { lineHeight: "1.7" }],
        sm: ["0.9375rem", { lineHeight: "1.6" }],
        xs: ["0.875rem", { lineHeight: "1.55" }],
        micro: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
      },
    },
  },
  plugins: [typography], 
};

export default config;
