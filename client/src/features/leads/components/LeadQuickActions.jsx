// client/src/features/leads/components/LeadQuickActions.jsx

import React, { useState } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Chip,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Note as NoteIcon,
  Label as LabelIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useLeadMutations } from '../hooks';
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS
} from '../utils/leadHelpers';

const LeadQuickActions = ({ 
  onRefresh, 
  currentLeadId = null,
  position = 'bottom-right' // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}) => {
  const [open, setOpen] = useState(false);
  const [quickAddDialog, setQuickAddDialog] = useState(false);
  const [quickNoteDialog, setQuickNoteDialog] = useState(false);
  const [followUpDialog, setFollowUpDialog] = useState(false);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form states
  const [quickLead, setQuickLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    value: ''
  });
  const [quickNote, setQuickNote] = useState({
    leadId: '',
    note: ''
  });
  const [followUp, setFollowUp] = useState({
    leadId: '',
    date: new Date(),
    note: ''
  });
  const [statusUpdate, setStatusUpdate] = useState({
    leadId: '',
    status: '',
    note: ''
  });

  const { createLead, addNote, updateLead, updateLeadStatus, loading } = useLeadMutations();

  // Position styles
  const getPositionStyles = () => {
    const baseStyles = { position: 'fixed', zIndex: 1200 };
    switch (position) {
      case 'bottom-right':
        return { ...baseStyles, bottom: 16, right: 16 };
      case 'bottom-left':
        return { ...baseStyles, bottom: 16, left: 16 };
      case 'top-right':
        return { ...baseStyles, top: 80, right: 16 };
      case 'top-left':
        return { ...baseStyles, top: 80, left: 16 };
      default:
        return { ...baseStyles, bottom: 16, right: 16 };
    }
  };

  // Quick add lead handler
  const handleQuickAdd = async () => {
    if (!quickLead.name || !quickLead.email || !quickLead.phone) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    try {
      await createLead({
        ...quickLead,
        value: quickLead.value ? parseFloat(quickLead.value) : 0,
        status: LEAD_STATUSES.NEW
      });
      
      setQuickAddDialog(false);
      setQuickLead({ name: '', email: '', phone: '', source: '', value: '' });
      setSnackbar({ open: true, message: 'Lead added successfully', severity: 'success' });
      if (onRefresh) onRefresh();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add lead', severity: 'error' });
    }
  };

  // Quick note handler
  const handleQuickNote = async () => {
    if (!quickNote.leadId || !quickNote.note) {
      setSnackbar({ open: true, message: 'Please select a lead and add a note', severity: 'error' });
      return;
    }

    try {
      await addNote(quickNote.leadId, quickNote.note);
      
      setQuickNoteDialog(false);
      setQuickNote({ leadId: '', note: '' });
      setSnackbar({ open: true, message: 'Note added successfully', severity: 'success' });
      if (onRefresh) onRefresh();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add note', severity: 'error' });
    }
  };

  // Follow up handler
  const handleFollowUp = async () => {
    if (!followUp.leadId || !followUp.date) {
      setSnackbar({ open: true, message: 'Please select a lead and date', severity: 'error' });
      return;
    }

    try {
      await updateLead(followUp.leadId, { 
        nextFollowUp: followUp.date,
        $push: followUp.note ? { 
          notes: { 
            text: `Follow-up scheduled: ${followUp.note}`,
            createdAt: new Date()
          } 
        } : undefined
      });
      
      setFollowUpDialog(false);
      setFollowUp({ leadId: '', date: new Date(), note: '' });
      setSnackbar({ open: true, message: 'Follow-up scheduled successfully', severity: 'success' });
      if (onRefresh) onRefresh();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to schedule follow-up', severity: 'error' });
    }
  };

  // Status update handler
  const handleStatusUpdate = async () => {
    if (!statusUpdate.leadId || !statusUpdate.status) {
      setSnackbar({ open: true, message: 'Please select a lead and status', severity: 'error' });
      return;
    }

    try {
      await updateLeadStatus(statusUpdate.leadId, statusUpdate.status);
      
      if (statusUpdate.note) {
        await addNote(statusUpdate.leadId, `Status updated to ${LEAD_STATUS_LABELS[statusUpdate.status]}: ${statusUpdate.note}`);
      }
      
      setStatusUpdateDialog(false);
      setStatusUpdate({ leadId: '', status: '', note: '' });
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
      if (onRefresh) onRefresh();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const actions = [
    { 
      icon: <PersonIcon />, 
      name: 'Quick Add Lead',
      onClick: () => setQuickAddDialog(true),
      color: 'primary'
    },
    { 
      icon: <NoteIcon />, 
      name: 'Add Note',
      onClick: () => {
        if (currentLeadId) {
          setQuickNote({ ...quickNote, leadId: currentLeadId });
        }
        setQuickNoteDialog(true);
      },
      color: 'secondary'
    },
    { 
      icon: <CalendarIcon />, 
      name: 'Schedule Follow-up',
      onClick: () => {
        if (currentLeadId) {
          setFollowUp({ ...followUp, leadId: currentLeadId });
        }
        setFollowUpDialog(true);
      },
      color: 'warning'
    },
    { 
      icon: <LabelIcon />, 
      name: 'Update Status',
      onClick: () => {
        if (currentLeadId) {
          setStatusUpdate({ ...statusUpdate, leadId: currentLeadId });
        }
        setStatusUpdateDialog(true);
      },
      color: 'success'
    }
  ];

  return (
    <>
      <Box sx={getPositionStyles()}>
        <SpeedDial
          ariaLabel="Quick actions"
          icon={<SpeedDialIcon />}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          direction="up"
          sx={{
            '& .MuiFab-primary': {
              backgroundColor: '#F0F015',
              color: '#013BDB',
              '&:hover': {
                backgroundColor: '#FFD700'
              }
            }
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
              sx={{
                backgroundColor: theme => theme.palette[action.color].main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme => theme.palette[action.color].dark
                }
              }}
            />
          ))}
        </SpeedDial>
      </Box>

      {/* Quick Add Lead Dialog */}
      <Dialog open={quickAddDialog} onClose={() => setQuickAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Quick Add Lead</Typography>
            <IconButton onClick={() => setQuickAddDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={quickLead.name}
              onChange={(e) => setQuickLead({ ...quickLead, name: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={quickLead.email}
              onChange={(e) => setQuickLead({ ...quickLead, email: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={quickLead.phone}
              onChange={(e) => setQuickLead({ ...quickLead, phone: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select
                value={quickLead.source}
                onChange={(e) => setQuickLead({ ...quickLead, source: e.target.value })}
                label="Source"
              >
                {Object.entries(LEAD_SOURCES).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {LEAD_SOURCE_LABELS[value]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Estimated Value"
              type="number"
              value={quickLead.value}
              onChange={(e) => setQuickLead({ ...quickLead, value: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleQuickAdd} 
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#F0F015',
              color: '#013BDB',
              '&:hover': { backgroundColor: '#FFD700' }
            }}
          >
            Add Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Note Dialog */}
      <Dialog open={quickNoteDialog} onClose={() => setQuickNoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Add Quick Note</Typography>
            <IconButton onClick={() => setQuickNoteDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {!currentLeadId && (
              <Typography variant="body2" color="text.secondary">
                Select a lead to add a note (you can also do this from the lead detail page)
              </Typography>
            )}
            <TextField
              fullWidth
              label="Note"
              multiline
              rows={4}
              value={quickNote.note}
              onChange={(e) => setQuickNote({ ...quickNote, note: e.target.value })}
              placeholder="Enter your note..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickNoteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleQuickNote} 
            variant="contained"
            disabled={loading || (!currentLeadId && !quickNote.leadId)}
          >
            Add Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={followUpDialog} onClose={() => setFollowUpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Schedule Follow-up</Typography>
            <IconButton onClick={() => setFollowUpDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {!currentLeadId && (
              <Typography variant="body2" color="text.secondary">
                Select a lead to schedule a follow-up
              </Typography>
            )}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Follow-up Date & Time"
                value={followUp.date}
                onChange={(date) => setFollowUp({ ...followUp, date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Note (optional)"
              multiline
              rows={3}
              value={followUp.note}
              onChange={(e) => setFollowUp({ ...followUp, note: e.target.value })}
              placeholder="Add any notes about this follow-up..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFollowUpDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleFollowUp} 
            variant="contained"
            disabled={loading || (!currentLeadId && !followUp.leadId)}
            sx={{
              backgroundColor: '#FF9800',
              '&:hover': { backgroundColor: '#F57C00' }
            }}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialog} onClose={() => setStatusUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Update Lead Status</Typography>
            <IconButton onClick={() => setStatusUpdateDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {!currentLeadId && (
              <Typography variant="body2" color="text.secondary">
                Select a lead to update status
              </Typography>
            )}
            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select
                value={statusUpdate.status}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                label="New Status"
              >
                {Object.entries(LEAD_STATUSES).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    <Chip
                      label={LEAD_STATUS_LABELS[value]}
                      size="small"
                      sx={{
                        backgroundColor: `${value === LEAD_STATUSES.WON ? '#4CAF50' : value === LEAD_STATUSES.LOST ? '#F44336' : '#2196F3'}`,
                        color: 'white'
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Note (optional)"
              multiline
              rows={3}
              value={statusUpdate.note}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, note: e.target.value })}
              placeholder="Add any notes about this status change..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            disabled={loading || (!currentLeadId && !statusUpdate.leadId)}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#388E3C' }
            }}
          >
            Update Status
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

export default LeadQuickActions;