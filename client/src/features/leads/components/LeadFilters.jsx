// client/src/features/leads/components/LeadFilters.jsx

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  InputAdornment,
  Button,
  Collapse,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS
} from '../utils/leadHelpers';

const LeadFilters = ({ 
  filters = {}, 
  onFilterChange, 
  onClearFilters,
  users = [] // List of users for assignee filter
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onFilterChange({ search: value });
    }, 300);
  };

  const handleFilterChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onClearFilters();
  };

  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key] && key !== 'search'
  ).length;

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search leads by name, email, company..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchTerm('');
                      onFilterChange({ search: '' });
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ position: 'relative' }}
            >
              Filters
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    height: 20,
                    minWidth: 20,
                    fontSize: '0.75rem'
                  }}
                />
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button
                variant="text"
                color="error"
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Collapse in={showAdvanced}>
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.entries(LEAD_STATUSES).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {LEAD_STATUS_LABELS[value]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Source</InputLabel>
                <Select
                  value={filters.source || ''}
                  label="Source"
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.entries(LEAD_SOURCES).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {LEAD_SOURCE_LABELS[value]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={filters.assignedTo || ''}
                  label="Assigned To"
                  onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Project Type</InputLabel>
                <Select
                  value={filters.projectType || ''}
                  label="Project Type"
                  onChange={(e) => handleFilterChange('projectType', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.entries(PROJECT_TYPES).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {PROJECT_TYPE_LABELS[value]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Created From"
                  value={filters.createdFrom || null}
                  onChange={(date) => handleFilterChange('createdFrom', date)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Created To"
                  value={filters.createdTo || null}
                  onChange={(date) => handleFilterChange('createdTo', date)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Min Value"
                type="number"
                value={filters.minValue || ''}
                onChange={(e) => handleFilterChange('minValue', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Max Value"
                type="number"
                value={filters.maxValue || ''}
                onChange={(e) => handleFilterChange('maxValue', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === 'search') return null;
                  
                  let label = `${key}: ${value}`;
                  
                  // Format filter labels
                  if (key === 'status') label = `Status: ${LEAD_STATUS_LABELS[value]}`;
                  if (key === 'source') label = `Source: ${LEAD_SOURCE_LABELS[value]}`;
                  if (key === 'projectType') label = `Type: ${PROJECT_TYPE_LABELS[value]}`;
                  if (key === 'assignedTo') {
                    const user = users.find(u => u._id === value);
                    label = `Assigned: ${user ? user.name : value}`;
                  }
                  if (key === 'minValue') label = `Min: $${value}`;
                  if (key === 'maxValue') label = `Max: $${value}`;
                  if (key === 'createdFrom' || key === 'createdTo') {
                    const date = new Date(value).toLocaleDateString();
                    label = `${key === 'createdFrom' ? 'From' : 'To'}: ${date}`;
                  }
                  
                  return (
                    <Chip
                      key={key}
                      label={label}
                      size="small"
                      onDelete={() => handleFilterChange(key, '')}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default LeadFilters;