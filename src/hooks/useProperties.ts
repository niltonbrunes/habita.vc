'use client';

import { useState, useEffect } from 'react';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await PropertiesService.getAll();
      setProperties(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return { properties, loading, error, refresh: fetchProperties };
}
