'use client';

import { useEffect } from 'react';
import { mockService } from '@/lib/services/mockService';

/**
 * Initializes mock data on first app load
 * Seeds localStorage with realistic demo data
 */
export function MockDataInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      mockService.initializeMockData();
    }
  }, []);

  return null; // This component only runs side effects
}
