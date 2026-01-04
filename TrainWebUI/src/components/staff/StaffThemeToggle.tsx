"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export function StaffThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          theme === "light"
            ? "bg-success text-white border-success"
            : "bg-background border-border hover:border-success/50"
        }`}
        aria-label="Chế độ sáng"
      >
        <Sun className="h-4 w-4" />
        <span className="text-sm font-medium">Sáng</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          theme === "dark"
            ? "bg-success text-white border-success"
            : "bg-background border-border hover:border-success/50"
        }`}
        aria-label="Chế độ tối"
      >
        <Moon className="h-4 w-4" />
        <span className="text-sm font-medium">Tối</span>
      </button>
    </div>
  );
}
