import React from 'react'
import { Container, Typography, Grid, Card, CardContent, Box, Button, Accordion, AccordionSummary, AccordionDetails, TextField, Paper } from '@mui/material'
import { ExpandMore, Email, Phone, Chat, Help, Article, HeadsetMic, Schedule } from '@mui/icons-material'
import '../styles/Support.css'

function Support() {
  const [expanded, setExpanded] = React.useState(false)

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const faqs = [
    {
      id: 'faq1',
      question: 'How do I get started with LynkUpPro?',
      answer: 'Getting started is easy! After signing up, you\'ll receive a welcome email with login credentials. Our onboarding wizard will guide you through setting up your account, importing contacts, and customizing your dashboard. We also offer free onboarding sessions for all new customers.'
    },
    {
      id: 'faq2',
      question: 'Can I import my existing customer data?',
      answer: 'Yes! LynkUpPro supports data import from CSV, Excel files, and many popular CRM systems. Our import wizard will help map your fields correctly, and our support team is available to assist with large or complex data migrations.'
    },
    {
      id: 'faq3',
      question: 'Is my data secure?',
      answer: 'Absolutely. We use industry-standard 256-bit SSL encryption for all data transmission and storage. Our servers are hosted in secure, SOC 2 compliant data centers with 24/7 monitoring, regular backups, and disaster recovery protocols.'
    },
    {
      id: 'faq4',
      question: 'What integrations are available?',
      answer: 'LynkUpPro integrates with popular tools like Google Calendar, Outlook, QuickBooks, DocuSign, and more. We\'re constantly adding new integrations based on customer feedback. Check our integrations page for the full list.'
    },
    {
      id: 'faq5',
      question: 'Can I customize LynkUpPro for my business?',
      answer: 'Yes! LynkUpPro is highly customizable. You can create custom fields, workflows, templates, and reports. Our Professional and Enterprise plans include advanced customization options and API access for deeper integrations.'
    },
    {
      id: 'faq6',
      question: 'What kind of support do you offer?',
      answer: 'We offer multiple support channels including email, phone, and live chat during business hours. Professional and Enterprise customers receive priority support with faster response times. We also provide extensive documentation, video tutorials, and regular webinars.'
    }
  ]

  const supportChannels = [
    {
      icon: <Email />,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'support@lynkuppro.com',
      buttonText: 'Send Email'
    },
    {
      icon: <Phone />,
      title: 'Phone Support',
      description: 'Talk to our support team directly',
      action: '1-800-LYNK-PRO',
      buttonText: 'Call Now'
    },
    {
      icon: <Chat />,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      action: 'Available 9 AM - 5 PM EST',
      buttonText: 'Start Chat'
    }
  ]

  const resources = [
    {
      icon: <Article />,
      title: 'Documentation',
      description: 'Detailed guides and API docs'
    },
    {
      icon: <Help />,
      title: 'Knowledge Base',
      description: 'Articles and tutorials'
    },
    {
      icon: <HeadsetMic />,
      title: 'Webinars',
      description: 'Live training sessions'
    },
    {
      icon: <Schedule />,
      title: 'Release Notes',
      description: 'Latest updates and features'
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Support Center
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We're here to help you succeed with LynkUpPro
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {supportChannels.map((channel, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  backgroundColor: '#F0F015', 
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  {React.cloneElement(channel.icon, { sx: { fontSize: 40, color: '#013BDB' } })}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#013BDB' }}>
                  {channel.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {channel.description}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {channel.action}
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: '#013BDB' }}>
                  {channel.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq) => (
          <Accordion 
            key={faq.id}
            expanded={expanded === faq.id} 
            onChange={handleAccordionChange(faq.id)}
            sx={{ 
              mb: 2,
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: '1px solid #e0e0e0',
              borderRadius: '8px !important',
              overflow: 'hidden'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ 
                backgroundColor: expanded === faq.id ? '#F5F5F5' : 'transparent',
                '&:hover': { backgroundColor: '#F5F5F5' }
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#013BDB' }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#013BDB' }}>
              Quick Resources
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {resources.map((resource, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2,
                    cursor: 'pointer',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#F5F5F5' }
                  }}>
                    <Box sx={{ 
                      backgroundColor: '#F0F015', 
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      {React.cloneElement(resource.icon, { sx: { color: '#013BDB' } })}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {resource.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {resource.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%', backgroundColor: '#013BDB', color: 'white' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography paragraph>
              Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
            </Typography>
            <Box component="form" sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Your Name"
                variant="filled"
                sx={{ 
                  mb: 2,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiFilledInput-root': {
                    color: 'white',
                    '&:before': { borderBottomColor: 'rgba(255,255,255,0.5)' },
                    '&:hover:before': { borderBottomColor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="filled"
                sx={{ 
                  mb: 2,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiFilledInput-root': {
                    color: 'white',
                    '&:before': { borderBottomColor: 'rgba(255,255,255,0.5)' },
                    '&:hover:before': { borderBottomColor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                variant="filled"
                sx={{ 
                  mb: 2,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiFilledInput-root': {
                    color: 'white',
                    '&:before': { borderBottomColor: 'rgba(255,255,255,0.5)' },
                    '&:hover:before': { borderBottomColor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
              <Button 
                variant="contained" 
                fullWidth
                sx={{ 
                  backgroundColor: '#F0F015',
                  color: '#013BDB',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#d4d400' }
                }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ 
        textAlign: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 3,
        p: 4
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#013BDB' }}>
          Need Immediate Assistance?
        </Typography>
        <Typography paragraph color="text.secondary">
          Our support team is available Monday-Friday, 9 AM - 5 PM EST
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" size="large" sx={{ backgroundColor: '#013BDB' }}>
            Schedule a Call
          </Button>
          <Button variant="outlined" size="large" sx={{ borderColor: '#013BDB', color: '#013BDB' }}>
            View System Status
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Support