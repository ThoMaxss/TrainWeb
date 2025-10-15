'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ThemeToggleProps {
  variant?: 'full' | 'simple';
  align?: 'start' | 'center' | 'end';
}

export function ThemeToggle({ variant = 'full', align = 'end' }: ThemeToggleProps = {}) {
  const { theme, setTheme, actualTheme, toggleTheme } = useTheme();

  // Simple toggle (chỉ light/dark)
  if (variant === 'simple') {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleTheme}
        className="h-10 w-10 rounded-lg bg-card border border-border hover:bg-muted/50 focus:ring-2 focus:ring-ring transition-colors"
        aria-label={actualTheme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
      >
        {actualTheme === 'light' ? (
          <Moon className="h-4 w-4 text-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-foreground" />
        )}
      </Button>
    );
  }

  // Full toggle (light/dark/system)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 rounded-lg bg-card border border-border hover:bg-muted/50 focus:ring-2 focus:ring-ring transition-colors"
          aria-label="Chọn theme"
        >
          {theme === 'system' ? (
            <Monitor className="h-4 w-4 text-foreground" />
          ) : actualTheme === 'light' ? (
            <Sun className="h-4 w-4 text-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[160px] bg-card border-border">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="flex items-center gap-3 text-foreground hover:bg-muted/50 focus:bg-muted/50"
        >
          <Sun className="h-4 w-4" />
          Sáng
          {theme === 'light' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="flex items-center gap-3 text-foreground hover:bg-muted/50 focus:bg-muted/50"
        >
          <Moon className="h-4 w-4" />
          Tối
          {theme === 'dark' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="flex items-center gap-3 text-foreground hover:bg-muted/50 focus:bg-muted/50"
        >
          <Monitor className="h-4 w-4" />
          Hệ thống
          {theme === 'system' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Backwards compatibility exports
export const SimpleThemeToggle = () => <ThemeToggle variant="simple" />;
export const FullThemeToggle = () => <ThemeToggle variant="full" />;