// client/src/components/WhyChooseLynkupro.jsx

import React from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  Grid,
  Slide,
  Paper
} from '@mui/material'
import { CheckCircle, Construction, TrendingUp, Groups } from '@mui/icons-material'
import '../styles/WhyChooseLynkupro.css'

function WhyChooseLynkupro({ isVisible }) {
  const benefits = [
    'Reduce project delays by 35% with better communication',
    'Win more bids with professional estimates',
    'Never miss a follow-up with automated reminders',
    'Access your data anywhere, anytime',
    'Integrate with tools you already use'
  ]

  return (
    <section className="why-choose-section">
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="why-choose-image-container">
              <Paper 
                elevation={3} 
                className="why-choose-card why-choose-card-1"
                sx={{
                  backgroundColor: '#F0F015',
                  padding: 3,
                  textAlign: 'center',
                  position: 'absolute',
                  width: 280,
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 0,
                  left: 0,
                  zIndex: 3
                }}
              >
                <Construction sx={{ fontSize: 48, color: '#013BDB', mb: 1 }} />
                <Typography variant="h6" sx={{ color: '#013BDB', fontWeight: 600 }}>
                  Project Management
                </Typography>
              </Paper>
              
              <Paper 
                elevation={3} 
                className="why-choose-card why-choose-card-2"
                sx={{
                  backgroundColor: '#013BDB',
                  padding: 3,
                  textAlign: 'center',
                  position: 'absolute',
                  width: 280,
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 60,
                  left: 60,
                  zIndex: 2
                }}
              >
                <TrendingUp sx={{ fontSize: 48, color: '#FFFFFF', mb: 1 }} />
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  Growth Analytics
                </Typography>
              </Paper>
              
              <Paper 
                elevation={2} 
                className="why-choose-card why-choose-card-3"
                sx={{
                  backgroundColor: '#FFFFFF',
                  padding: 3,
                  textAlign: 'center',
                  position: 'absolute',
                  width: 280,
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 120,
                  left: 120,
                  zIndex: 1,
                  border: '2px solid #F5F5F5'
                }}
              >
                <Groups sx={{ fontSize: 48, color: '#013BDB', mb: 1 }} />
                <Typography variant="h6" sx={{ color: '#013BDB', fontWeight: 600 }}>
                  Team Collaboration
                </Typography>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" className="why-choose-title">
              Why Construction Companies Choose LynkuPro
            </Typography>
            <Box className="why-choose-benefits-list">
              {benefits.map((benefit, index) => (
                <Slide
                  direction="left"
                  in={isVisible || true}
                  timeout={500 + index * 100}
                  key={index}
                >
                  <Box className="why-choose-benefit-item">
                    <CheckCircle className="why-choose-check-icon" />
                    <Typography>{benefit}</Typography>
                  </Box>
                </Slide>
              ))}
            </Box>
            <Button 
              variant="contained" 
              size="large"
              className="why-choose-cta-button"
            >
              See All Features
            </Button>
          </Grid>
        </Grid>
      </Container>
    </section>
  )
}

export default WhyChooseLynkupro