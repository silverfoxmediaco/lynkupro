// client/src/features/leads/hooks/useLeads.js

import { useState, useEffect, useCallback } from 'react';
import leadService from '../services/leadService';

export const useLeads = (initialFilters = {}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  });

  // Fetch leads with current filters
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await leadService.getLeads(params);
      
      setLeads(response.data || []);
      
      // Update pagination if backend provides it
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Change page size
  const changePageSize = useCallback((newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  // Search leads
  const searchLeads = useCallback(async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await leadService.searchLeads(searchTerm);
      setLeads(response.data || []);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh leads
  const refresh = useCallback(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    changePageSize,
    searchLeads,
    refresh
  };
};