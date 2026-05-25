'use client';

import { useState, useEffect, useCallback } from 'react';
import { LeadsService } from '@/services/leads.service';
import { Lead, LeadStatus } from '@/types/database';
import { useAuth } from '@/context/AuthContext';

export function useLeads() {
  const { profile, isRole } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!profile) return;
    try {
      setLoading(true);

      let data: Lead[];
      if (isRole(['admin', 'director'])) {
        // Admin/Director vê tudo
        data = await LeadsService.getAll();
      } else if (isRole(['manager'])) {
        // Gerente vê leads da equipe dele + os próprios
        data = await LeadsService.getByTeamOf(profile.id);
      } else {
        // Corretor vê apenas os próprios
        const all = await LeadsService.getAll();
        data = all.filter(l => l.assigned_to_id === profile.id);
      }

      setLeads(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, profile?.role]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

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
