// client/src/features/leads/hooks/useLead.js

import { useState, useEffect, useCallback } from 'react';
import leadService from '../services/leadService';

export const useLead = (leadId) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single lead
  const fetchLead = useCallback(async () => {
    if (!leadId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await leadService.getLead(leadId);
      setLead(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch lead');
      console.error('Error fetching lead:', err);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  // Initial fetch
  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  // Update lead locally after mutations
  const updateLeadLocally = useCallback((updatedData) => {
    setLead(prev => ({ ...prev, ...updatedData }));
  }, []);

  // Add note locally
  const addNoteLocally = useCallback((note) => {
    setLead(prev => ({
      ...prev,
      notes: [...(prev.notes || []), note]
    }));
  }, []);

  // Refresh lead data
  const refresh = useCallback(() => {
    fetchLead();
  }, [fetchLead]);

  return {
    lead,
    loading,
    error,
    refresh,
    updateLeadLocally,
    addNoteLocally
  };
};