'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';

/**
 * Admin Theme Toggle - Simple light/dark toggle for admin interface
 * Designed to match admin page styling with violet accent
 */
export function AdminThemeToggle() {
  const { actualTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent transition-colors">
      <div className="flex items-center gap-3 flex-1">
        {actualTheme === 'light' ? (
          <Sun className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-muted-foreground" />
        )}
        <div>
          <p className="font-medium">Giao diện</p>
          <p className="text-sm text-muted-foreground">
            {actualTheme === 'light' ? 'Chế độ sáng' : 'Chế độ tối'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant={actualTheme === 'light' ? 'default' : 'outline'}
          size="sm"
          onClick={() => actualTheme !== 'light' && toggleTheme()}
          className="gap-2 h-8 px-3"
        >
          <Sun className="h-4 w-4" />
          Sáng
        </Button>
        <Button
          variant={actualTheme === 'dark' ? 'default' : 'outline'}
          size="sm"
          onClick={() => actualTheme !== 'dark' && toggleTheme()}
          className="gap-2 h-8 px-3"
        >
          <Moon className="h-4 w-4" />
          Tối
        </Button>
      </div>
    </div>
  );
}
