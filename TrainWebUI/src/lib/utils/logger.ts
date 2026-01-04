/**
 * Production-safe logger utility
 * Only logs in development mode
 */

const IS_DEV = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (IS_DEV) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (IS_DEV) {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (IS_DEV) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (IS_DEV) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (IS_DEV) {
      console.debug(...args);
    }
  },
};
