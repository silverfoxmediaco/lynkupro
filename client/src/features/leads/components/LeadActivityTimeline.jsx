// client/src/features/leads/components/LeadActivityTimeline.jsx

import React from 'react';
import {
  Box,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  Paper,
  Chip
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Label as LabelIcon,
  Note as NoteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '../utils/leadHelpers';

// Mock activity data - in a real app, this would come from the backend
const getMockActivities = (leadId) => {
  return [
    {
      id: 1,
      type: 'created',
      description: 'Lead created',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      icon: PersonAddIcon,
      color: 'primary'
    },
    {
      id: 2,
      type: 'status_change',
      description: 'Status changed to Contacted',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: LabelIcon,
      color: 'secondary',
      metadata: { from: 'new', to: 'contacted' }
    },
    {
      id: 3,
      type: 'note',
      description: 'Added a note',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      icon: NoteIcon,
      color: 'info',
      metadata: { note: 'Had initial call with client. They are interested in a kitchen renovation.' }
    },
    {
      id: 4,
      type: 'email',
      description: 'Email sent',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: EmailIcon,
      color: 'success',
      metadata: { subject: 'Kitchen Renovation Proposal' }
    },
    {
      id: 5,
      type: 'status_change',
      description: 'Status changed to Qualified',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      icon: LabelIcon,
      color: 'secondary',
      metadata: { from: 'contacted', to: 'qualified' }
    }
  ];
};

const LeadActivityTimeline = ({ leadId }) => {
  const activities = getMockActivities(leadId);

  const getActivityIcon = (activity) => {
    const Icon = activity.icon;
    return (
      <TimelineDot color={activity.color || 'grey'}>
        <Icon fontSize="small" />
      </TimelineDot>
    );
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const renderActivityContent = (activity) => {
    switch (activity.type) {
      case 'status_change':
        return (
          <Box>
            <Typography variant="body2">
              {activity.description}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={LEAD_STATUS_LABELS[activity.metadata.from]}
                size="small"
                sx={{
                  backgroundColor: LEAD_STATUS_COLORS[activity.metadata.from],
                  color: 'white',
                  height: 20,
                  fontSize: '0.75rem'
                }}
              />
              <Typography variant="caption">→</Typography>
              <Chip
                label={LEAD_STATUS_LABELS[activity.metadata.to]}
                size="small"
                sx={{
                  backgroundColor: LEAD_STATUS_COLORS[activity.metadata.to],
                  color: 'white',
                  height: 20,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
        );
      
      case 'note':
        return (
          <Box>
            <Typography variant="body2">
              {activity.description}
            </Typography>
            <Paper sx={{ mt: 1, p: 1.5, backgroundColor: '#f5f5f5' }}>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                "{activity.metadata.note}"
              </Typography>
            </Paper>
          </Box>
        );
      
      case 'email':
        return (
          <Box>
            <Typography variant="body2">
              {activity.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Subject: {activity.metadata.subject}
            </Typography>
          </Box>
        );
      
      default:
        return (
          <Typography variant="body2">
            {activity.description}
          </Typography>
        );
    }
  };

  return (
    <Box>
      <Timeline sx={{ p: 0 }}>
        {activities.map((activity, index) => (
          <TimelineItem key={activity.id}>
            <TimelineOppositeContent sx={{ m: 'auto 0', minWidth: 100 }}>
              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(activity.timestamp)}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              {getActivityIcon(activity)}
              {index < activities.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              {renderActivityContent(activity)}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                by {activity.user}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      
      {activities.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No activity recorded yet
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LeadActivityTimeline;