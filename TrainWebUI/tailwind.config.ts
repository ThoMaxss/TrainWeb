// tailwind.config.ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; // 👈 ESM import

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
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        card: "var(--card)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "disabled-text": "var(--disabled-text)",
        border: "var(--border)",
        "disabled-bg": "var(--disabled-bg)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        "hover-primary": "var(--hover-primary)",
        "active-primary": "var(--active-primary)",
        "hover-accent": "var(--hover-accent)",
        "active-accent": "var(--active-accent)",
      },
      ringColor: { ring: "var(--focus-ring)" },
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
