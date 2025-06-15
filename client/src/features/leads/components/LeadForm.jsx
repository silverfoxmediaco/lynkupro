// client/src/features/leads/components/LeadForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Alert,
  Snackbar,
  Autocomplete,
  Chip,
  FormHelperText,
  Skeleton,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  CalendarToday as CalendarIcon,
  Label as LabelIcon,
  Source as SourceIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useLead, useLeadMutations } from '../hooks';
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS
} from '../utils/leadHelpers';

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  // Hooks
  const { lead, loading: leadLoading, error: leadError } = useLead(id);
  const { createLead, updateLead, loading: mutationLoading } = useLeadMutations();

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    company: '',
    
    // Lead Details
    status: LEAD_STATUSES.NEW,
    source: '',
    projectType: '',
    value: '',
    probability: 0,
    
    // Address
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    
    // Additional
    estimatedStartDate: null,
    budget: {
      min: '',
      max: ''
    },
    notes: '',
    tags: [],
    assignedTo: ''
  });

  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load existing lead data
  useEffect(() => {
    if (isEdit && lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || LEAD_STATUSES.NEW,
        source: lead.source || '',
        projectType: lead.projectType || '',
        value: lead.value || '',
        probability: lead.probability || 0,
        address: {
          street: lead.address?.street || '',
          city: lead.address?.city || '',
          state: lead.address?.state || '',
          zipCode: lead.address?.zipCode || '',
          country: lead.address?.country || 'USA'
        },
        estimatedStartDate: lead.estimatedStartDate ? new Date(lead.estimatedStartDate) : null,
        budget: {
          min: lead.budget?.min || '',
          max: lead.budget?.max || ''
        },
        notes: '',
        tags: lead.tags || [],
        assignedTo: lead.assignedTo?._id || ''
      });
    }
  }, [isEdit, lead]);

  // Form steps
  const steps = [
    {
      label: 'Basic Information',
      description: 'Contact details',
    },
    {
      label: 'Lead Details',
      description: 'Project and value information',
    },
    {
      label: 'Additional Information',
      description: 'Address and other details',
    }
  ];

  // Handle input changes
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Step 1 validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    // Step 2 validation
    if (activeStep === 1) {
      if (!formData.source) {
        newErrors.source = 'Source is required';
      }
      if (formData.value && isNaN(formData.value)) {
        newErrors.value = 'Value must be a number';
      }
      if (formData.probability < 0 || formData.probability > 100) {
        newErrors.probability = 'Probability must be between 0 and 100';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      setActiveStep(prev => prev + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const leadData = {
        ...formData,
        value: formData.value ? parseFloat(formData.value) : 0,
        probability: parseInt(formData.probability) || 0,
        budget: {
          min: formData.budget.min ? parseFloat(formData.budget.min) : 0,
          max: formData.budget.max ? parseFloat(formData.budget.max) : 0
        }
      };
      
      if (isEdit) {
        await updateLead(id, leadData);
        setSnackbar({ open: true, message: 'Lead updated successfully', severity: 'success' });
      } else {
        const newLead = await createLead(leadData);
        setSnackbar({ open: true, message: 'Lead created successfully', severity: 'success' });
        setTimeout(() => {
          navigate(`/leads/${newLead._id}`);
        }, 1500);
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to save lead', severity: 'error' });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/leads');
  };

  // Loading state
  if (isEdit && leadLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
        </Paper>
      </Container>
    );
  }

  // Error state
  if (isEdit && leadError) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">{leadError}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/leads')} sx={{ mt: 2 }}>
          Back to Leads
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/leads')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {isEdit ? 'Edit Lead' : 'New Lead'}
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  <Typography variant="caption">{step.description}</Typography>
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {index === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        value={formData.company}
                        onChange={handleChange('company')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                {index === 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors.source}>
                        <InputLabel>Lead Source</InputLabel>
                        <Select
                          value={formData.source}
                          onChange={handleChange('source')}
                          label="Lead Source"
                        >
                          {Object.entries(LEAD_SOURCES).map(([key, value]) => (
                            <MenuItem key={value} value={value}>
                              {LEAD_SOURCE_LABELS[value]}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.source && <FormHelperText>{errors.source}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Project Type</InputLabel>
                        <Select
                          value={formData.projectType}
                          onChange={handleChange('projectType')}
                          label="Project Type"
                        >
                          <MenuItem value="">None</MenuItem>
                          {Object.entries(PROJECT_TYPES).map(([key, value]) => (
                            <MenuItem key={value} value={value}>
                              {PROJECT_TYPE_LABELS[value]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Estimated Value"
                        type="number"
                        value={formData.value}
                        onChange={handleChange('value')}
                        error={!!errors.value}
                        helperText={errors.value}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Probability"
                        type="number"
                        value={formData.probability}
                        onChange={handleChange('probability')}
                        error={!!errors.probability}
                        helperText={errors.probability}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PercentIcon />
                            </InputAdornment>
                          ),
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status}
                          onChange={handleChange('status')}
                          label="Status"
                        >
                          {Object.entries(LEAD_STATUSES).map(([key, value]) => (
                            <MenuItem key={value} value={value}>
                              {LEAD_STATUS_LABELS[value]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Estimated Start Date"
                          value={formData.estimatedStartDate}
                          onChange={(date) => setFormData(prev => ({ ...prev, estimatedStartDate: date }))}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                )}

                {index === 2 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Address
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={formData.address.street}
                        onChange={handleChange('address.street')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={formData.address.city}
                        onChange={handleChange('address.city')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="State"
                        value={formData.address.state}
                        onChange={handleChange('address.state')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="ZIP Code"
                        value={formData.address.zipCode}
                        onChange={handleChange('address.zipCode')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Budget Range
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Minimum Budget"
                        type="number"
                        value={formData.budget.min}
                        onChange={handleChange('budget.min')}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Maximum Budget"
                        type="number"
                        value={formData.budget.max}
                        onChange={handleChange('budget.max')}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Initial Notes"
                        multiline
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange('notes')}
                        placeholder="Add any initial notes about this lead..."
                      />
                    </Grid>
                  </Grid>
                )}

                {/* Step Actions */}
                <Box sx={{ mt: 3 }}>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  {index === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={mutationLoading}
                      startIcon={mutationLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                      sx={{
                        backgroundColor: '#F0F015',
                        color: '#013BDB',
                        '&:hover': { backgroundColor: '#FFD700' }
                      }}
                    >
                      {isEdit ? 'Update Lead' : 'Create Lead'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        backgroundColor: '#013BDB',
                        '&:hover': { backgroundColor: '#0230b0' }
                      }}
                    >
                      Next
                    </Button>
                  )}
                  <Button
                    onClick={handleCancel}
                    sx={{ ml: 1 }}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LeadForm;