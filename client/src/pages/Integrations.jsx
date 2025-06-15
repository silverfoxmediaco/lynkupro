import React from 'react'
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Chip } from '@mui/material'
import '../styles/Integrations.css'

function Integrations() {
  const integrations = [
    {
      id: 1,
      name: 'Google Calendar',
      description: 'Sync your construction schedules and meetings with Google Calendar',
      category: 'Calendar',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Outlook',
      description: 'Connect with Microsoft Outlook for email and calendar integration',
      category: 'Email & Calendar',
      status: 'Available'
    },
    {
      id: 3,
      name: 'DocuSign',
      description: 'Electronic signatures for contracts and documents',
      category: 'eSignature',
      status: 'Available'
    },
    {
      id: 4,
      name: 'HelloSign',
      description: 'Simple and secure electronic signature solution',
      category: 'eSignature',
      status: 'Coming Soon'
    },
    {
      id: 5,
      name: 'QuickBooks',
      description: 'Accounting integration for invoicing and payments',
      category: 'Accounting',
      status: 'Available'
    },
    {
      id: 6,
      name: 'Stripe',
      description: 'Payment processing for client transactions',
      category: 'Payments',
      status: 'Available'
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Integrations
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
        Connect LynkUpPro with your favorite tools to streamline your construction business
      </Typography>
      
      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid item xs={12} sm={6} md={4} key={integration.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, backgroundColor: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
                <Typography variant="h5" sx={{ color: '#013BDB', fontWeight: 'bold' }}>
                  {integration.name}
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={integration.category} 
                    size="small" 
                    sx={{ backgroundColor: '#F0F015', color: '#2D2D2D' }}
                  />
                  <Chip 
                    label={integration.status} 
                    size="small" 
                    color={integration.status === 'Available' ? 'success' : 'default'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {integration.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Integrations