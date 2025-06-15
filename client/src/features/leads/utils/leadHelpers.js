// client/src/features/leads/utils/leadHelpers.js

// Lead status configuration
export const LEAD_STATUSES = {
    NEW: 'new',
    CONTACTED: 'contacted',
    QUALIFIED: 'qualified',
    PROPOSAL: 'proposal',
    NEGOTIATION: 'negotiation',
    WON: 'won',
    LOST: 'lost'
  };
  
  export const LEAD_STATUS_LABELS = {
    [LEAD_STATUSES.NEW]: 'New',
    [LEAD_STATUSES.CONTACTED]: 'Contacted',
    [LEAD_STATUSES.QUALIFIED]: 'Qualified',
    [LEAD_STATUSES.PROPOSAL]: 'Proposal',
    [LEAD_STATUSES.NEGOTIATION]: 'Negotiation',
    [LEAD_STATUSES.WON]: 'Won',
    [LEAD_STATUSES.LOST]: 'Lost'
  };
  
  export const LEAD_STATUS_COLORS = {
    [LEAD_STATUSES.NEW]: '#2196F3',
    [LEAD_STATUSES.CONTACTED]: '#FF9800',
    [LEAD_STATUSES.QUALIFIED]: '#9C27B0',
    [LEAD_STATUSES.PROPOSAL]: '#00BCD4',
    [LEAD_STATUSES.NEGOTIATION]: '#FFC107',
    [LEAD_STATUSES.WON]: '#4CAF50',
    [LEAD_STATUSES.LOST]: '#F44336'
  };
  
  // Lead source configuration
  export const LEAD_SOURCES = {
    WEBSITE: 'website',
    REFERRAL: 'referral',
    SOCIAL: 'social',
    EMAIL: 'email',
    PHONE: 'phone',
    OTHER: 'other'
  };
  
  export const LEAD_SOURCE_LABELS = {
    [LEAD_SOURCES.WEBSITE]: 'Website',
    [LEAD_SOURCES.REFERRAL]: 'Referral',
    [LEAD_SOURCES.SOCIAL]: 'Social Media',
    [LEAD_SOURCES.EMAIL]: 'Email',
    [LEAD_SOURCES.PHONE]: 'Phone',
    [LEAD_SOURCES.OTHER]: 'Other'
  };
  
  // Project type configuration
  export const PROJECT_TYPES = {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    INDUSTRIAL: 'industrial',
    RENOVATION: 'renovation',
    OTHER: 'other'
  };
  
  export const PROJECT_TYPE_LABELS = {
    [PROJECT_TYPES.RESIDENTIAL]: 'Residential',
    [PROJECT_TYPES.COMMERCIAL]: 'Commercial',
    [PROJECT_TYPES.INDUSTRIAL]: 'Industrial',
    [PROJECT_TYPES.RENOVATION]: 'Renovation',
    [PROJECT_TYPES.OTHER]: 'Other'
  };
  
  // Format currency
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };
  
  // Format phone number
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  };
  
  // Calculate lead score
  export const calculateLeadScore = (lead) => {
    let score = 0;
    
    // Value-based scoring
    if (lead.value) {
      if (lead.value >= 100000) score += 30;
      else if (lead.value >= 50000) score += 20;
      else if (lead.value >= 10000) score += 10;
      else score += 5;
    }
    
    // Probability-based scoring
    score += (lead.probability || 0) * 0.3;
    
    // Status-based scoring
    const statusScores = {
      [LEAD_STATUSES.NEW]: 5,
      [LEAD_STATUSES.CONTACTED]: 10,
      [LEAD_STATUSES.QUALIFIED]: 20,
      [LEAD_STATUSES.PROPOSAL]: 30,
      [LEAD_STATUSES.NEGOTIATION]: 40
    };
    score += statusScores[lead.status] || 0;
    
    // Engagement scoring (notes count)
    if (lead.notes && lead.notes.length > 0) {
      score += Math.min(lead.notes.length * 2, 10);
    }
    
    return Math.round(score);
  };
  
  // Get lead age in days
  export const getLeadAge = (lead) => {
    if (!lead.createdAt) return 0;
    
    const created = new Date(lead.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Format lead age
  export const formatLeadAge = (lead) => {
    const days = getLeadAge(lead);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    
    return `${Math.floor(days / 365)} years ago`;
  };
  
  // Get initials from name
  export const getInitials = (name) => {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
  };
  
  // Sort leads
  export const sortLeads = (leads, sortBy, sortOrder = 'asc') => {
    const sorted = [...leads].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle nested properties
      if (sortBy.includes('.')) {
        const keys = sortBy.split('.');
        aValue = keys.reduce((obj, key) => obj?.[key], a);
        bValue = keys.reduce((obj, key) => obj?.[key], b);
      }
      
      // Handle null/undefined values
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      // Compare values
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  };
  
  // Filter leads by search term
  export const filterLeadsBySearch = (leads, searchTerm) => {
    if (!searchTerm) return leads;
    
    const term = searchTerm.toLowerCase();
    
    return leads.filter(lead => {
      return (
        lead.name?.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.phone?.includes(term) ||
        lead.company?.toLowerCase().includes(term) ||
        lead.notes?.some(note => note.text?.toLowerCase().includes(term))
      );
    });
  };
  
  // Get lead summary stats
  export const getLeadStats = (leads) => {
    const stats = {
      total: leads.length,
      byStatus: {},
      bySource: {},
      totalValue: 0,
      averageValue: 0,
      conversionRate: 0
    };
    
    leads.forEach(lead => {
      // Count by status
      stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1;
      
      // Count by source
      stats.bySource[lead.source] = (stats.bySource[lead.source] || 0) + 1;
      
      // Sum values
      stats.totalValue += lead.value || 0;
    });
    
    // Calculate averages
    if (leads.length > 0) {
      stats.averageValue = stats.totalValue / leads.length;
      stats.conversionRate = ((stats.byStatus.won || 0) / leads.length) * 100;
    }
    
    return stats;
  };