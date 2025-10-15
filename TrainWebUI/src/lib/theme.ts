/**
 * 🎨 UNIFIED DESIGN SYSTEM
 * Sử dụng CSS variables từ globals.css (HEX color system mới)
 * Đảm bảo tất cả components đồng bộ với theme system
 */

// ===============================
// 🎯 COMPONENT CLASS BUILDERS
// ===============================

export const themes = {
  // Background & Surfaces
  bg: {
    primary: 'bg-background',
    card: 'bg-card',
    muted: 'bg-muted',
    accent: 'bg-accent',
    brand: 'bg-primary',
    destructive: 'bg-error',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info',
  },
  
  // Text Colors
  text: {
    primary: 'text-foreground',
    muted: 'text-muted',
    brand: 'text-primary',
    accent: 'text-accent',
    destructive: 'text-error',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  },

  // Borders
  border: {
    default: 'border-border',
    input: 'border-border',
    ring: 'focus-visible:ring-2 focus-visible:ring-ring',
  },

  // Interactive States
  hover: {
    primary: 'hover:bg-hover-primary',
    accent: 'hover:bg-hover-accent',
    muted: 'hover:bg-muted/50',
    destructive: 'hover:opacity-90',
  },
} as const;

// ===============================
// 🎨 BUTTON VARIANTS (CSS Variables)
// ===============================
export const buttonVariants = {
  default: [
    themes.bg.brand,
    'text-white',
    themes.hover.primary,
    'active:bg-active-primary',
    themes.border.ring,
    'transition-colors',
  ].join(' '),

  outline: [
    'bg-transparent',
    themes.text.primary,
    themes.border.default,
    'border',
    themes.hover.muted,
    themes.border.ring,
    'transition-colors',
  ].join(' '),

  ghost: [
    'bg-transparent',
    themes.text.primary,
    themes.hover.muted,
    themes.border.ring,
    'transition-colors',
  ].join(' '),

  destructive: [
    themes.bg.destructive,
    'text-white',
    themes.hover.destructive,
    themes.border.ring,
    'transition-colors',
  ].join(' '),
  
  accent: [
    themes.bg.accent,
    'text-white',
    themes.hover.accent,
    'active:bg-active-accent',
    themes.border.ring,
    'transition-colors',
  ].join(' '),
} as const;

// ===============================
// 🃏 CARD VARIANTS
// ===============================
export const cardVariants = {
  default: [
    themes.bg.card,
    themes.text.primary,
    themes.border.default,
    'border',
    'rounded-2xl',
    'shadow-card',
  ].join(' '),

  hover: [
    'transition-all duration-200 ease-out',
    'hover:shadow-[0_14px_38px_-12px_rgba(15,23,42,0.22)]',
    'hover:-translate-y-0.5',
  ].join(' '),
} as const;

// ===============================
// 🏷️ BADGE VARIANTS
// ===============================
export const badgeVariants = {
  default: [
    themes.bg.brand,
    'text-white',
  ].join(' '),

  outline: [
    'bg-transparent',
    themes.text.primary,
    themes.border.default,
    'border',
  ].join(' '),

  success: themes.bg.success + ' text-white',
  warning: themes.bg.warning + ' text-white',
  error: themes.bg.destructive + ' text-white',
  info: themes.bg.info + ' text-white',
  
  // Subtle variants (với opacity)
  successSubtle: 'bg-success/10 text-success border border-success/20',
  warningSubtle: 'bg-warning/10 text-warning border border-warning/20',
  errorSubtle: 'bg-error/10 text-error border border-error/20',
  infoSubtle: 'bg-info/10 text-info border border-info/20',
  primarySubtle: 'bg-primary/10 text-primary border border-primary/20',
  accentSubtle: 'bg-accent/10 text-accent border border-accent/20',
} as const;

// ===============================
// 📝 INPUT VARIANTS  
// ===============================
export const inputVariants = {
  default: [
    'bg-background',
    themes.text.primary,
    themes.border.input,
    'border',
    'rounded-lg',
    'px-3 py-2',
    'outline-none',
    'focus:border-transparent',
    'focus:ring-2 focus:ring-ring',
    'placeholder:text-muted',
    'transition-all',
    'disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed',
  ].join(' '),
} as const;

// ===============================
// 🎯 ROLE-BASED COLORS (Updated với color system mới)
// ===============================
export const roleColors = {
  admin: {
    bg: 'bg-error',
    text: 'text-error',
    border: 'border-error/20',
    hover: 'hover:bg-error/10',
    badge: 'bg-error/10 text-error border border-error/20',
  },
  staff: {
    bg: 'bg-success',
    text: 'text-success',
    border: 'border-success/20',
    hover: 'hover:bg-success/10',
    badge: 'bg-success/10 text-success border border-success/20',
  },
  passenger: {
    bg: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary/20',
    hover: 'hover:bg-primary/10',
    badge: 'bg-primary/10 text-primary border border-primary/20',
  },
} as const;

// ===============================
// 🚨 STATUS COLORS (Updated)
// ===============================
export const statusColors = {
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
    solid: 'bg-success text-white',
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning', 
    border: 'border-warning/20',
    solid: 'bg-warning text-white',
  },
  error: {
    bg: 'bg-error/10',
    text: 'text-error',
    border: 'border-error/20',
    solid: 'bg-error text-white',
  },
  info: {
    bg: 'bg-info/10',
    text: 'text-info',
    border: 'border-info/20',
    solid: 'bg-info text-white',
  },
} as const;

// ===============================
// 🛠️ UTILITY FUNCTIONS
// ===============================

/**
 * Combine className with theme-aware classes
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get role-specific styling
 */
export function getRoleStyle(role: 'admin' | 'staff' | 'passenger') {
  return roleColors[role];
}

/**
 * Get status-specific styling  
 */
export function getStatusStyle(status: 'success' | 'warning' | 'error' | 'info') {
  return statusColors[status];
}