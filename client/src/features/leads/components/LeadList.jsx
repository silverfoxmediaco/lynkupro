// client/src/features/leads/components/LeadList.jsx

import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  Divider,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  Label as LabelIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LeadTable from './LeadTable';
import LeadFilters from './LeadFilters';
import { useLeads, useLeadMutations } from '../hooks';

const LeadList = () => {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [bulkActionsAnchor, setBulkActionsAnchor] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Hooks
  const {
    leads,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    changePageSize,
    refresh
  } = useLeads();

  const {
    deleteLead,
    bulkUpdateStatus,
    bulkAssignLeads,
    bulkDeleteLeads,
    loading: mutationLoading
  } = useLeadMutations();

  // Handle sorting
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(column);
    updateFilters({ sortBy: column, sortOrder: isAsc ? 'desc' : 'asc' });
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    changePage(newPage + 1); // MUI uses 0-based index
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    changePageSize(parseInt(event.target.value, 10));
  };

  // Handle lead selection
  const handleSelectLead = (newSelected) => {
    setSelectedLeads(newSelected);
  };

  const handleSelectAll = (newSelected) => {
    setSelectedLeads(newSelected);
  };

  // Navigation handlers
  const handleViewLead = (leadId) => {
    navigate(`/leads/${leadId}`);
  };

  const handleEditLead = (leadId) => {
    navigate(`/leads/${leadId}/edit`);
  };

  const handleCreateLead = () => {
    navigate('/leads/new');
  };

  // Delete handlers
  const handleDeleteClick = (leadId) => {
    setLeadToDelete(leadId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (leadToDelete) {
        await deleteLead(leadToDelete);
        setSnackbar({ 
          open: true, 
          message: 'Lead deleted successfully', 
          severity: 'success' 
        });
      } else if (selectedLeads.length > 0) {
        await bulkDeleteLeads(selectedLeads);
        setSnackbar({ 
          open: true, 
          message: `${selectedLeads.length} leads deleted successfully`, 
          severity: 'success' 
        });
        setSelectedLeads([]);
      }
      refresh();
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to delete lead(s)', 
        severity: 'error' 
      });
    } finally {
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  // Quick action handlers
  const handleEmailLead = (lead) => {
    window.location.href = `mailto:${lead.email}`;
  };

  const handleCallLead = (lead) => {
    window.location.href = `tel:${lead.phone}`;
  };

  // Bulk action handlers
  const handleBulkDelete = () => {
    setDeleteDialogOpen(true);
    setBulkActionsAnchor(null);
  };

  const handleBulkAssign = () => {
    // TODO: Open assign dialog
    setBulkActionsAnchor(null);
  };

  const handleBulkStatusChange = () => {
    // TODO: Open status change dialog
    setBulkActionsAnchor(null);
  };

  // Export handler
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export leads');
  };

  // Import handler
  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import leads');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Leads
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleImport}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateLead}
            sx={{
              backgroundColor: '#F0F015',
              color: '#013BDB',
              '&:hover': {
                backgroundColor: '#FFD700'
              }
            }}
          >
            New Lead
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <LeadFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        users={[]} // TODO: Get users list
      />

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1">
            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={(e) => setBulkActionsAnchor(e.currentTarget)}
              endIcon={<MoreVertIcon />}
            >
              Bulk Actions
            </Button>
            <Menu
              anchorEl={bulkActionsAnchor}
              open={Boolean(bulkActionsAnchor)}
              onClose={() => setBulkActionsAnchor(null)}
            >
              <MenuItem onClick={handleBulkAssign}>
                <AssignmentIcon sx={{ mr: 1 }} /> Assign To
              </MenuItem>
              <MenuItem onClick={handleBulkStatusChange}>
                <LabelIcon sx={{ mr: 1 }} /> Change Status
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleBulkDelete} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </Box>
        </Paper>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Leads Table */}
      <LeadTable
        leads={leads}
        loading={loading || mutationLoading}
        selectedLeads={selectedLeads}
        onSelectLead={handleSelectLead}
        onSelectAll={handleSelectAll}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={pagination.page - 1} // MUI uses 0-based index
        rowsPerPage={pagination.limit}
        totalCount={pagination.total}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onViewLead={handleViewLead}
        onEditLead={handleEditLead}
        onDeleteLead={handleDeleteClick}
        onEmailLead={handleEmailLead}
        onCallLead={handleCallLead}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {leadToDelete 
              ? 'Are you sure you want to delete this lead? This action cannot be undone.'
              : `Are you sure you want to delete ${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''}? This action cannot be undone.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' },
          backgroundColor: '#F0F015',
          color: '#013BDB',
          '&:hover': {
            backgroundColor: '#FFD700'
          }
        }}
        onClick={handleCreateLead}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default LeadList;