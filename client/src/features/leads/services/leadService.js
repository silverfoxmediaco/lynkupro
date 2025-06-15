// client/src/features/leads/services/leadService.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class LeadService {
  // Get auth token from localStorage
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all leads with filters
  async getLeads(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/leads${queryString ? `?${queryString}` : ''}`, {
        headers: {
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  // Get single lead by ID
  async getLead(id) {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        headers: {
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch lead: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  }

  // Create new lead
  async createLead(leadData) {
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create lead');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  // Update lead
  async updateLead(id, leadData) {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update lead');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  // Delete lead
  async deleteLead(id) {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'DELETE',
        headers: {
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete lead: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }

  // Assign lead to user
  async assignLead(id, userId) {
    try {
      const response = await fetch(`${API_URL}/leads/${id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign lead');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error assigning lead:', error);
      throw error;
    }
  }

  // Update lead status
  async updateLeadStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/leads/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update lead status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  }

  // Add note to lead
  async addLeadNote(id, noteText) {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ 
          $push: { 
            notes: { 
              text: noteText,
              createdAt: new Date()
            } 
          } 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add note');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateStatus(leadIds, status) {
    try {
      const updates = await Promise.all(
        leadIds.map(id => this.updateLeadStatus(id, status))
      );
      return updates;
    } catch (error) {
      console.error('Error in bulk status update:', error);
      throw error;
    }
  }

  async bulkAssignLeads(leadIds, userId) {
    try {
      const updates = await Promise.all(
        leadIds.map(id => this.assignLead(id, userId))
      );
      return updates;
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      throw error;
    }
  }

  async bulkDeleteLeads(leadIds) {
    try {
      const deletions = await Promise.all(
        leadIds.map(id => this.deleteLead(id))
      );
      return deletions;
    } catch (error) {
      console.error('Error in bulk deletion:', error);
      throw error;
    }
  }

  // Search leads
  async searchLeads(searchTerm) {
    return this.getLeads({ search: searchTerm });
  }

  // Get leads by status
  async getLeadsByStatus(status) {
    return this.getLeads({ status });
  }

  // Get leads assigned to user
  async getLeadsByUser(userId) {
    return this.getLeads({ assignedTo: userId });
  }
}

export default new LeadService();