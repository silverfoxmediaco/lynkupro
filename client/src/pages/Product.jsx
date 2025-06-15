import React from 'react'
import { Container, Typography, Grid, Card, CardContent, Box, Button, List, ListItem, ListItemIcon, ListItemText, Tabs, Tab } from '@mui/material'
import { Check, Dashboard, People, CalendarToday, Description, Assessment, Build, Email, CloudUpload } from '@mui/icons-material'
import '../styles/Product.css'

function Product() {
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const features = {
    0: [
      { icon: <Dashboard />, title: 'Intuitive Dashboard', description: 'Get a complete overview of your projects, leads, and team performance' },
      { icon: <People />, title: 'Lead Management', description: 'Track and manage leads through your sales pipeline' },
      { icon: <CalendarToday />, title: 'Calendar Integration', description: 'Sync with Google Calendar and Outlook for seamless scheduling' },
      { icon: <Description />, title: 'Document Management', description: 'Store and organize all project documents in one place' }
    ],
    1: [
      { icon: <Assessment />, title: 'Advanced Analytics', description: 'Detailed insights into project profitability and performance' },
      { icon: <Build />, title: 'Estimate Builder', description: 'Create professional estimates with material cost calculator' },
      { icon: <Email />, title: 'Automated Messaging', description: 'Set up automated email templates and triggers' },
      { icon: <CloudUpload />, title: 'Cloud Storage', description: 'Secure cloud storage with automatic backups' }
    ]
  }

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$49',
      period: 'per user/month',
      features: [
        'Up to 5 users',
        'Basic CRM features',
        'Calendar integration',
        '10GB storage',
        'Email support'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$99',
      period: 'per user/month',
      features: [
        'Up to 25 users',
        'Advanced CRM features',
        'All integrations',
        '100GB storage',
        'Priority support',
        'Custom workflows',
        'Advanced analytics'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      features: [
        'Unlimited users',
        'All features',
        'Unlimited storage',
        'Dedicated support',
        'Custom integrations',
        'On-premise option',
        'Training included'
      ],
      highlighted: false
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          The Complete CRM for Construction
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Everything you need to manage your construction business in one platform
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            mt: 2, 
            backgroundColor: '#F0F015', 
            color: '#013BDB',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#d4d400' }
          }}
        >
          Start Free Trial
        </Button>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Key Features
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Core Features" />
          <Tab label="Advanced Tools" />
        </Tabs>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features[tabValue].map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2 }}>
                <Box sx={{ 
                  mr: 2, 
                  backgroundColor: '#F0F015', 
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.cloneElement(feature.icon, { sx: { color: '#013BDB' } })}
                </Box>
                <CardContent sx={{ flex: 1, p: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#013BDB' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Pricing Plans
        </Typography>
        <Grid container spacing={3} alignItems="stretch">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: plan.highlighted ? '2px solid #013BDB' : '1px solid #e0e0e0',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {plan.highlighted && (
                  <Box sx={{
                    position: 'absolute',
                    top: -15,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#013BDB',
                    color: 'white',
                    px: 3,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    MOST POPULAR
                  </Box>
                )}
                <CardContent sx={{ flex: 1, pt: plan.highlighted ? 4 : 3 }}>
                  <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#013BDB' }}>
                    {plan.name}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" component="span" sx={{ fontWeight: 'bold' }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.period}
                    </Typography>
                  </Box>
                  <List dense>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ color: '#4CAF50', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    fullWidth 
                    variant={plan.highlighted ? 'contained' : 'outlined'}
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: plan.highlighted ? '#013BDB' : 'transparent',
                      '&:hover': { 
                        backgroundColor: plan.highlighted ? '#0230b0' : 'rgba(1, 59, 219, 0.04)' 
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ 
        backgroundColor: '#F5F5F5', 
        borderRadius: 3, 
        p: 4, 
        textAlign: 'center' 
      }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ready to transform your construction business?
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          Join thousands of contractors who trust LynkUpPro to manage their projects
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            backgroundColor: '#013BDB',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#0230b0' }
          }}
        >
          Start Your Free 14-Day Trial
        </Button>
      </Box>
    </Container>
  )
}

export default Product