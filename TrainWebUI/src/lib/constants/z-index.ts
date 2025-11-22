/**
 * 🎯 Z-Index Hierarchy Constants
 * 
 * Centralized z-index management to prevent stacking context conflicts.
 * Values are organized in ascending order from base to top-most layer.
 * 
 * Usage:
 * ```tsx
 * import { Z_INDEX } from '@/lib/constants/z-index';
 * 
 * <header className={`sticky top-0 z-[${Z_INDEX.HEADER}]`}>
 * ```
 */

export const Z_INDEX = {
  // ============================================
  // BASE LAYER (0-10)
  // ============================================
  /** Default layer for regular content */
  BASE: 0,
  
  /** Decorative elements behind content */
  BEHIND: -1,
  
  /** Dropdown backdrops and subtle overlays */
  DROPDOWN_BACKDROP: 10,

  // ============================================
  // STICKY ELEMENTS (20-29)
  // ============================================
  /** Sticky sidebars and secondary navigation */
  STICKY_SIDEBAR: 20,
  
  /** Sticky filters and toolbars */
  STICKY_FILTER: 25,

  // ============================================
  // NAVIGATION LAYER (30-39)
  // ============================================
  /** Main headers and top navigation */
  HEADER: 30,
  
  /** Mobile menu dropdowns (above header) */
  MOBILE_MENU: 35,

  // ============================================
  // OVERLAY LAYER (40-49)
  // ============================================
  /** Bottom sheets and drawers */
  BOTTOM_SHEET: 40,

  // ============================================
  // DROPDOWN LAYER (50-59)
  // ============================================
  /** Dropdown menus, select options, popovers */
  DROPDOWN: 50,
  
  /** Popovers (same level as dropdowns) */
  POPOVER: 50,
  
  /** Select components */
  SELECT: 50,

  // ============================================
  // MODAL LAYER (60-79)
  // ============================================
  /** Modal dialog overlays (backdrop) */
  MODAL_OVERLAY: 60,
  
  /** Modal dialog content */
  MODAL_CONTENT: 70,
  
  /** Alert dialogs (higher priority than regular modals) */
  ALERT_DIALOG: 75,

  // ============================================
  // TOP LAYER (80-99)
  // ============================================
  /** Tooltips (should appear above everything except toasts) */
  TOOLTIP: 80,
  
  /** Toast notifications (top-most layer) */
  TOAST: 90,
} as const;

/**
 * Type-safe z-index keys
 */
export type ZIndexKey = keyof typeof Z_INDEX;

/**
 * Get z-index value by key
 */
export const getZIndex = (key: ZIndexKey): number => Z_INDEX[key];

/**
 * Tailwind z-index class mapping
 * Use this for dynamic class generation
 */
export const Z_INDEX_CLASSES = {
  BASE: 'z-0',
  BEHIND: '-z-10',
  DROPDOWN_BACKDROP: 'z-10',
  STICKY_SIDEBAR: 'z-20',
  STICKY_FILTER: 'z-[25]',
  HEADER: 'z-[30]',
  MOBILE_MENU: 'z-[35]',
  BOTTOM_SHEET: 'z-40',
  DROPDOWN: 'z-50',
  POPOVER: 'z-50',
  SELECT: 'z-50',
  MODAL_OVERLAY: 'z-[60]',
  MODAL_CONTENT: 'z-[70]',
  ALERT_DIALOG: 'z-[75]',
  TOOLTIP: 'z-[80]',
  TOAST: 'z-[90]',
} as const;
