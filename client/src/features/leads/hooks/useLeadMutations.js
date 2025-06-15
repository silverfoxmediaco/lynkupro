// client/src/features/leads/hooks/useLeadMutations.js

import { useState, useCallback } from 'react';
import leadService from '../services/leadService';

export const useLeadMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create lead
  const createLead = useCallback(async (leadData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await leadService.createLead(leadData);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create lead');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update lead
  const updateLead = useCallback(async (id, leadData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await leadService.updateLead(id, leadData);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update lead');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete lead
  const deleteLead = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await leadService.deleteLead(id);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete lead');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update lead status
  const updateLeadStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await leadService.updateLeadStatus(id, status);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update lead status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Assign lead
  const assignLead = useCallback(async (id, userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await leadService.assignLead(id, userId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to assign lead');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add note
  const addNote = useCallback(async (id, noteText) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await leadService.addLeadNote(id, noteText);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk operations
  const bulkUpdateStatus = useCallback(async (leadIds, status) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await leadService.bulkUpdateStatus(leadIds, status);
      return results;
    } catch (err) {
      setError(err.message || 'Failed to update leads');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkAssignLeads = useCallback(async (leadIds, userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await leadService.bulkAssignLeads(leadIds, userId);
      return results;
    } catch (err) {
      setError(err.message || 'Failed to assign leads');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteLeads = useCallback(async (leadIds) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await leadService.bulkDeleteLeads(leadIds);
      return results;
    } catch (err) {
      setError(err.message || 'Failed to delete leads');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
    updateLeadStatus,
    assignLead,
    addNote,
    bulkUpdateStatus,
    bulkAssignLeads,
    bulkDeleteLeads
  };
};