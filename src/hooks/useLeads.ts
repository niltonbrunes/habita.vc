'use client';

import { useState, useEffect } from 'react';
import { LeadsService } from '@/services/leads.service';
import { Lead, LeadStatus } from '@/types/database';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await LeadsService.getAll();
      setLeads(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const updated = await LeadsService.updateStatus(id, status);
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const leadsByStatus = leads.reduce((acc, lead) => {
    if (!acc[lead.status]) acc[lead.status] = [];
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  return { leads, leadsByStatus, loading, error, refresh: fetchLeads, updateLeadStatus };
}
