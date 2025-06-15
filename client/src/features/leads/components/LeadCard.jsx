// client/src/features/leads/components/LeadCard.jsx

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  formatCurrency,
  formatPhoneNumber,
  formatLeadAge,
  getInitials,
  calculateLeadScore,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_SOURCE_LABELS,
  PROJECT_TYPE_LABELS
} from '../utils/leadHelpers';

const LeadCard = ({ 
  lead, 
  onEdit,
  onDelete,
  onStatusChange,
  onDragStart,
  onDragEnd,
  isDragging = false,
  variant = 'default' // 'default' | 'compact' | 'detailed'
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const leadScore = calculateLeadScore(lead);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(`/leads/${lead._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    handleMenuClose();
    if (onEdit) {
      onEdit(lead._id);
    } else {
      navigate(`/leads/${lead._id}/edit`);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleMenuClose();
    if (onDelete) onDelete(lead._id);
  };

  const handleEmail = (e) => {
    e.stopPropagation();
    window.location.href = `mailto:${lead.email}`;
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${lead.phone}`;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4CAF50';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  // Compact variant for pipeline view
  if (variant === 'compact') {
    return (
      <Card
        sx={{
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isDragging ? 0.5 : 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          },
          mb: 1.5
        }}
        onClick={handleCardClick}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#013BDB' }}>
              {lead.name}
            </Typography>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {lead.company && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {lead.company}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
              {formatCurrency(lead.value)}
            </Typography>
            <Chip
              label={`${lead.probability || 0}%`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                backgroundColor: getScoreColor(leadScore),
                color: 'white'
              }}
            />
          </Box>
        </CardContent>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        overflow: 'visible'
      }}
      onClick={handleCardClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Lead Score Indicator */}
      <LinearProgress
        variant="determinate"
        value={leadScore}
        sx={{
          height: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getScoreColor(leadScore)
          }
        }}
      />

      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#013BDB', mb: 0.5 }}>
              {lead.name}
            </Typography>
            {lead.company && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {lead.company}
                </Typography>
              </Box>
            )}
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Contact Info */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Tooltip title="Send Email">
              <IconButton size="small" onClick={handleEmail}>
                <EmailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {lead.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Call">
              <IconButton size="small" onClick={handleCall}>
                <PhoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {formatPhoneNumber(lead.phone)}
            </Typography>
          </Box>
        </Box>

        {/* Lead Details */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MoneyIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                {formatCurrency(lead.value)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {lead.probability || 0}%
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={LEAD_STATUS_LABELS[lead.status]}
              size="small"
              sx={{
                backgroundColor: LEAD_STATUS_COLORS[lead.status],
                color: 'white',
                fontWeight: 500
              }}
            />
            {lead.projectType && (
              <Chip
                label={PROJECT_TYPE_LABELS[lead.projectType]}
                size="small"
                variant="outlined"
              />
            )}
            <Chip
              label={LEAD_SOURCE_LABELS[lead.source] || lead.source}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {lead.assignedTo ? (
              <>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                  {getInitials(lead.assignedTo.name)}
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {lead.assignedTo.name}
                </Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Unassigned
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatLeadAge(lead)}
            </Typography>
          </Box>
        </Box>

        {/* Next Follow-up */}
        {lead.nextFollowUp && (
          <Box sx={{ mt: 2, p: 1, backgroundColor: '#FFF3E0', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ color: '#E65100' }}>
              Follow-up: {new Date(lead.nextFollowUp).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => { handleMenuClose(); handleCardClick(); }}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleEmail}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Send Email
        </MenuItem>
        <MenuItem onClick={handleCall}>
          <PhoneIcon fontSize="small" sx={{ mr: 1 }} /> Call
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default LeadCard;