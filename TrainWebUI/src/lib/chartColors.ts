// Centralized chart color tokens so Recharts and other visual components can share consistent colors
export const CHART_COLORS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  destructive: 'var(--color-destructive)',
  info: 'var(--color-info)',
  momo: 'var(--color-momo)',
  indigo: 'var(--color-secondary)',
};

export const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.destructive,
];

export default CHART_COLORS;
