// client/src/components/RunYourBusiness.jsx

import React from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card,
  CardContent,
  Zoom
} from '@mui/material'
import {
  Timeline,
  Groups,
  RequestQuote,
  Analytics
} from '@mui/icons-material'
import '../styles/RunYourBusiness.css'

function RunYourBusiness({ isVisible }) {
  const features = [
    {
      icon: <Timeline sx={{ fontSize: 40 }} />,
      title: 'Project Pipeline',
      description: 'Track projects from lead to completion with our visual pipeline',
      color: 'yellow'
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      title: 'Team Collaboration',
      description: 'Keep your entire crew connected and on the same page',
      color: 'blue'
    },
    {
      icon: <RequestQuote sx={{ fontSize: 40 }} />,
      title: 'Smart Estimates',
      description: 'Create professional estimates in minutes, not hours',
      color: 'yellow'
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Real-time Analytics',
      description: 'Make data-driven decisions with powerful insights',
      color: 'blue'
    }
  ]

  return (
    <section className="run-your-business-section" id="features">
      <Container maxWidth="lg">
        <Box className="run-your-business-header">
          <h2 className="run-your-business-title">
            Everything You Need to
            <br />
            <span className="run-your-business-gradient">Run Your Business</span>
          </h2>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Zoom in={isVisible || true} timeout={500 + index * 200}>
                <Card className="run-your-business-card">
                  <CardContent>
                    <Box className={`run-your-business-icon run-your-business-icon-${feature.color}`}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" className="run-your-business-feature-title">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="run-your-business-feature-description">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  )
}

export default RunYourBusiness