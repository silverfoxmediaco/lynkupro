// client/src/features/leads/components/LeadPipeline.jsx

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Skeleton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  DragIndicator as DragIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import LeadCard from './LeadCard';
import { useLeads, useLeadMutations } from '../hooks';
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  formatCurrency
} from '../utils/leadHelpers';

const LeadPipeline = ({ filters: externalFilters = {} }) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState({});
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [visibleColumns, setVisibleColumns] = useState(Object.values(LEAD_STATUSES));
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  // Hooks
  const { leads, loading, error, refresh } = useLeads(externalFilters);
  const { updateLeadStatus, deleteLead, loading: mutationLoading } = useLeadMutations();

  // Organize leads into columns by status
  useEffect(() => {
    const newColumns = {};
    
    // Initialize all columns
    Object.values(LEAD_STATUSES).forEach(status => {
      newColumns[status] = {
        id: status,
        title: LEAD_STATUS_LABELS[status],
        leads: [],
        color: LEAD_STATUS_COLORS[status]
      };
    });

    // Populate columns with leads
    leads.forEach(lead => {
      if (newColumns[lead.status]) {
        newColumns[lead.status].leads.push(lead);
      }
    });

    setColumns(newColumns);
  }, [leads]);

  // Handle drag end
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const leadId = draggableId;
    const newStatus = destination.droppableId;

    // Optimistically update UI
    const sourceCopy = { ...columns };
    const sourceColumn = sourceCopy[source.droppableId];
    const destColumn = sourceCopy[destination.droppableId];
    const lead = sourceColumn.leads.find(l => l._id === leadId);

    if (!lead) return;

    // Remove from source
    sourceColumn.leads = sourceColumn.leads.filter(l => l._id !== leadId);
    
    // Add to destination
    const updatedLead = { ...lead, status: newStatus };
    destColumn.leads.splice(destination.index, 0, updatedLead);
    
    setColumns(sourceCopy);

    // Update in backend
    try {
      await updateLeadStatus(leadId, newStatus);
      setSnackbar({
        open: true,
        message: `Lead moved to ${LEAD_STATUS_LABELS[newStatus]}`,
        severity: 'success'
      });
    } catch (error) {
      // Revert on error
      refresh();
      setSnackbar({
        open: true,
        message: 'Failed to update lead status',
        severity: 'error'
      });
    }
  };

  // Handle column menu
  const handleColumnMenuOpen = (event, columnId) => {
    event.stopPropagation();
    setColumnMenuAnchor(event.currentTarget);
    setSelectedColumn(columnId);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
    setSelectedColumn(null);
  };

  // Handle lead actions
  const handleDeleteLead = async () => {
    try {
      await deleteLead(leadToDelete);
      setDeleteDialog(false);
      setLeadToDelete(null);
      refresh();
      setSnackbar({
        open: true,
        message: 'Lead deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete lead',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (leadId) => {
    setLeadToDelete(leadId);
    setDeleteDialog(true);
  };

  // Calculate column stats
  const getColumnStats = (column) => {
    const totalValue = column.leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const count = column.leads.length;
    return { totalValue, count };
  };

  // Toggle column visibility
  const toggleColumnVisibility = (status) => {
    setVisibleColumns(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, p: 2, overflowX: 'auto' }}>
        {Object.values(LEAD_STATUSES).map(status => (
          <Paper key={status} sx={{ width: 320, p: 2 }}>
            <Skeleton variant="text" width={150} height={30} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </Paper>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2 }}>
        {/* Pipeline Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Lead Pipeline
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<ViewColumnIcon />}
              onClick={() => setColumnSettingsOpen(true)}
              size="small"
            >
              Columns
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/leads/new')}
              size="small"
              sx={{
                backgroundColor: '#F0F015',
                color: '#013BDB',
                '&:hover': { backgroundColor: '#FFD700' }
              }}
            >
              New Lead
            </Button>
          </Box>
        </Box>

        {/* Pipeline Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            overflowX: 'auto', 
            pb: 2,
            minHeight: 'calc(100vh - 250px)'
          }}>
            {Object.values(columns)
              .filter(column => visibleColumns.includes(column.id))
              .map(column => {
                const stats = getColumnStats(column);
                
                return (
                  <Paper
                    key={column.id}
                    sx={{
                      minWidth: 320,
                      maxWidth: 320,
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'fit-content',
                      minHeight: 200
                    }}
                  >
                    {/* Column Header */}
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: column.color,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {column.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="caption">
                            {stats.count} {stats.count === 1 ? 'lead' : 'leads'}
                          </Typography>
                          <Typography variant="caption">
                            {formatCurrency(stats.totalValue)}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleColumnMenuOpen(e, column.id)}
                        sx={{ color: 'white' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Column Content */}
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{
                            p: 2,
                            flexGrow: 1,
                            backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : '#f5f5f5',
                            transition: 'background-color 0.2s ease',
                            minHeight: 100
                          }}
                        >
                          {column.leads.length === 0 ? (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ textAlign: 'center', py: 4 }}
                            >
                              No leads
                            </Typography>
                          ) : (
                            column.leads.map((lead, index) => (
                              <Draggable 
                                key={lead._id} 
                                draggableId={lead._id} 
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{ mb: 1.5 }}
                                  >
                                    <LeadCard
                                      lead={lead}
                                      variant="compact"
                                      isDragging={snapshot.isDragging}
                                      onDelete={handleDeleteClick}
                                    />
                                  </Box>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>

                    {/* Add Lead Button */}
                    <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
                      <Button
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/leads/new?status=${column.id}`)}
                        size="small"
                      >
                        Add Lead
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
          </Box>
        </DragDropContext>
      </Box>

      {/* Column Menu */}
      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={handleColumnMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/leads?status=${selectedColumn}`);
          handleColumnMenuClose();
        }}>
          View All {selectedColumn && LEAD_STATUS_LABELS[selectedColumn]} Leads
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/leads/new?status=${selectedColumn}`);
          handleColumnMenuClose();
        }}>
          Add Lead to {selectedColumn && LEAD_STATUS_LABELS[selectedColumn]}
        </MenuItem>
      </Menu>

      {/* Column Settings Dialog */}
      <Dialog 
        open={columnSettingsOpen} 
        onClose={() => setColumnSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Pipeline Columns</Typography>
            <IconButton onClick={() => setColumnSettingsOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which columns to display in the pipeline view
          </Typography>
          {Object.entries(LEAD_STATUSES).map(([key, status]) => (
            <Box 
              key={status}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                py: 1,
                borderBottom: '1px solid #e0e0e0'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '4px',
                    backgroundColor: LEAD_STATUS_COLORS[status]
                  }}
                />
                <Typography>{LEAD_STATUS_LABELS[status]}</Typography>
              </Box>
              <Button
                size="small"
                variant={visibleColumns.includes(status) ? 'contained' : 'outlined'}
                onClick={() => toggleColumnVisibility(status)}
                sx={visibleColumns.includes(status) ? {
                  backgroundColor: '#013BDB',
                  '&:hover': { backgroundColor: '#0230b0' }
                } : {}}
              >
                {visibleColumns.includes(status) ? 'Visible' : 'Hidden'}
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisibleColumns(Object.values(LEAD_STATUSES))}>
            Show All
          </Button>
          <Button onClick={() => setColumnSettingsOpen(false)} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this lead? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteLead} 
            color="error" 
            variant="contained"
            disabled={mutationLoading}
          >
            {mutationLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LeadPipeline;