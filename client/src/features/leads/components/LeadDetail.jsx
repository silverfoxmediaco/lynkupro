// client/src/features/leads/components/LeadDetail.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Skeleton,
  Alert,
  Snackbar,
  Tab,
  Tabs
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Label as LabelIcon,
  Note as NoteIcon,
  History as HistoryIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useLead, useLeadMutations } from '../hooks';
import { 
  formatCurrency, 
  formatPhoneNumber, 
  formatLeadAge,
  getInitials,
  calculateLeadScore,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_SOURCE_LABELS,
  PROJECT_TYPE_LABELS,
  LEAD_STATUSES
} from '../utils/leadHelpers';
import LeadActivityTimeline from './LeadActivityTimeline';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [noteDialog, setNoteDialog] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [assignDialog, setAssignDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Hooks
  const { lead, loading, error, refresh } = useLead(id);
  const { updateLeadStatus, assignLead, addNote, deleteLead } = useLeadMutations();

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle note submission
  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await addNote(id, newNote);
      setNewNote('');
      setNoteDialog(false);
      refresh();
      setSnackbar({ open: true, message: 'Note added successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add note', severity: 'error' });
    }
  };

  // Handle status change
  const handleStatusChange = async () => {
    try {
      await updateLeadStatus(id, newStatus);
      setStatusDialog(false);
      refresh();
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteLead(id);
      navigate('/leads');
      setSnackbar({ open: true, message: 'Lead deleted successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete lead', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={30} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={400} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={300} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !lead) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">
          {error || 'Lead not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/leads')}
          sx={{ mt: 2 }}
        >
          Back to Leads
        </Button>
      </Container>
    );
  }

  const leadScore = calculateLeadScore(lead);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <IconButton onClick={() => navigate('/leads')} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {lead.name}
            </Typography>
            <Chip
              label={LEAD_STATUS_LABELS[lead.status]}
              size="small"
              sx={{
                backgroundColor: LEAD_STATUS_COLORS[lead.status],
                color: 'white',
                fontWeight: 500
              }}
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            {lead.company} • Added {formatLeadAge(lead)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/leads/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={() => window.location.href = `mailto:${lead.email}`}
          >
            Email
          </Button>
          <Button
            variant="outlined"
            startIcon={<PhoneIcon />}
            onClick={() => window.location.href = `tel:${lead.phone}`}
          >
            Call
          </Button>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => { setAnchorEl(null); setStatusDialog(true); }}>
              <LabelIcon sx={{ mr: 1 }} /> Change Status
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); setAssignDialog(true); }}>
              <AssignmentIcon sx={{ mr: 1 }} /> Assign To
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); setDeleteDialog(true); }} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete Lead
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Overview" />
              <Tab label="Activity" />
              <Tab label="Documents" />
            </Tabs>
            
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                {/* Contact Information */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact Information
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <EmailIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body2">{lead.email}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                        <Typography variant="body2">{formatPhoneNumber(lead.phone)}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BusinessIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Company</Typography>
                        <Typography variant="body2">{lead.company || 'Not specified'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Address</Typography>
                        <Typography variant="body2">
                          {lead.address ? 
                            `${lead.address.street || ''} ${lead.address.city || ''} ${lead.address.state || ''}`.trim() || 'Not specified'
                            : 'Not specified'
                          }
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Project Details */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Project Details
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Project Type</Typography>
                      <Typography variant="body2">
                        {PROJECT_TYPE_LABELS[lead.projectType] || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Source</Typography>
                      <Typography variant="body2">
                        {LEAD_SOURCE_LABELS[lead.source] || lead.source}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Estimated Value</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        {formatCurrency(lead.value)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Probability</Typography>
                      <Typography variant="body2">{lead.probability || 0}%</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Notes */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Notes
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setNoteDialog(true)}
                  >
                    Add Note
                  </Button>
                </Box>
                {lead.notes && lead.notes.length > 0 ? (
                  <List>
                    {lead.notes.slice(-3).reverse().map((note, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <NoteIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={note.text}
                          secondary={`${note.createdBy?.name || 'Unknown'} • ${new Date(note.createdAt).toLocaleDateString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No notes yet
                  </Typography>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                <LeadActivityTimeline leadId={id} />
              </Box>
            )}

            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No documents uploaded yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Lead Score */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Lead Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: leadScore > 70 ? '#4CAF50' : leadScore > 40 ? '#FF9800' : '#F44336',
                    fontSize: '1.5rem',
                    fontWeight: 700
                  }}
                >
                  {leadScore}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {leadScore > 70 ? 'Hot Lead' : leadScore > 40 ? 'Warm Lead' : 'Cold Lead'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Based on value, engagement, and status
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Assigned To */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Assigned To
              </Typography>
              {lead.assignedTo ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>
                    {getInitials(lead.assignedTo.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {lead.assignedTo.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lead.assignedTo.email}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Unassigned
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Timeline
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Created</Typography>
                  <Typography variant="body2">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                {lead.lastContactDate && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Last Contact</Typography>
                    <Typography variant="body2">
                      {new Date(lead.lastContactDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                {lead.nextFollowUp && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Next Follow-up</Typography>
                    <Typography variant="body2" sx={{ color: '#FF9800', fontWeight: 600 }}>
                      {new Date(lead.nextFollowUp).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Note Dialog */}
      <Dialog open={noteDialog} onClose={() => setNoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialog(false)}>Cancel</Button>
          <Button onClick={handleAddNote} variant="contained">Add Note</Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {Object.entries(LEAD_STATUSES).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {LEAD_STATUS_LABELS[value]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained">Update Status</Button>
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
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
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
    </Container>
  );
};

export default LeadDetail;