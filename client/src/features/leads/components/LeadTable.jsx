// client/src/features/leads/components/LeadTable.jsx

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
  Skeleton
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { 
  formatCurrency, 
  formatPhoneNumber, 
  formatLeadAge,
  getInitials,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_SOURCE_LABELS
} from '../utils/leadHelpers';

const LeadTable = ({ 
  leads = [], 
  loading = false,
  selectedLeads = [],
  onSelectLead,
  onSelectAll,
  onSort,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 0,
  rowsPerPage = 25,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  onViewLead,
  onEditLead,
  onDeleteLead,
  onEmailLead,
  onCallLead
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = leads.map((lead) => lead._id);
      onSelectAll(newSelected);
      return;
    }
    onSelectAll([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedLeads.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedLeads, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedLeads.slice(1));
    } else if (selectedIndex === selectedLeads.length - 1) {
      newSelected = newSelected.concat(selectedLeads.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedLeads.slice(0, selectedIndex),
        selectedLeads.slice(selectedIndex + 1),
      );
    }

    onSelectLead(newSelected);
  };

  const isSelected = (id) => selectedLeads.indexOf(id) !== -1;

  const columns = [
    { id: 'name', label: 'Lead Name', sortable: true },
    { id: 'company', label: 'Company', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'value', label: 'Value', sortable: true, align: 'right' },
    { id: 'source', label: 'Source', sortable: true },
    { id: 'assignedTo', label: 'Assigned To', sortable: true },
    { id: 'createdAt', label: 'Created', sortable: true },
    { id: 'actions', label: 'Actions', align: 'center' }
  ];

  const LoadingRow = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.id}>
          <Skeleton variant="text" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader aria-label="leads table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedLeads.length > 0 && selectedLeads.length < leads.length}
                  checked={leads.length > 0 && selectedLeads.length === leads.length}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all leads',
                  }}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ fontWeight: 600 }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortOrder : 'asc'}
                      onClick={() => onSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingRow key={index} />
              ))
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No leads found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => {
                const isItemSelected = isSelected(lead._id);
                const labelId = `enhanced-table-checkbox-${lead._id}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={lead._id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={(event) => handleClick(event, lead._id)}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell 
                      component="th" 
                      id={labelId} 
                      scope="row"
                      onClick={() => onViewLead(lead._id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {lead.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {lead.email}
                      </Typography>
                    </TableCell>
                    <TableCell onClick={() => onViewLead(lead._id)}>
                      {lead.company || '-'}
                    </TableCell>
                    <TableCell onClick={() => onViewLead(lead._id)}>
                      <Chip
                        label={LEAD_STATUS_LABELS[lead.status]}
                        size="small"
                        sx={{
                          backgroundColor: LEAD_STATUS_COLORS[lead.status],
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" onClick={() => onViewLead(lead._id)}>
                      {formatCurrency(lead.value)}
                    </TableCell>
                    <TableCell onClick={() => onViewLead(lead._id)}>
                      {LEAD_SOURCE_LABELS[lead.source] || lead.source}
                    </TableCell>
                    <TableCell onClick={() => onViewLead(lead._id)}>
                      {lead.assignedTo ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {getInitials(lead.assignedTo.name)}
                          </Avatar>
                          <Typography variant="body2">
                            {lead.assignedTo.name}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => onViewLead(lead._id)}>
                      <Typography variant="body2">
                        {formatLeadAge(lead)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewLead(lead._id);
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditLead(lead._id);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Email">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEmailLead(lead);
                            }}
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Call">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCallLead(lead);
                            }}
                          >
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteLead(lead._id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default LeadTable;