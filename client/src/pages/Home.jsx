// client/src/pages/Home.jsx

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card,
  CardContent,
  IconButton,
  Fade,
  Slide,
  Zoom
} from '@mui/material'
import {
  Construction,
  Timeline,
  Groups,
  RequestQuote,
  Analytics,
  CloudSync,
  ArrowForward,
  CheckCircle,
  Speed,
  Security,
  Support,
  PlayCircle
} from '@mui/icons-material'
import '../styles/Home.css'

function Home() {
  const [isVisible, setIsVisible] = useState({})
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: <Timeline sx={{ fontSize: 40 }} />,
      title: 'Project Pipeline',
      description: 'Track projects from lead to completion with our visual pipeline',
      color: '#F0F015'
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      title: 'Team Collaboration',
      description: 'Keep your entire crew connected and on the same page',
      color: '#013BDB'
    },
    {
      icon: <RequestQuote sx={{ fontSize: 40 }} />,
      title: 'Smart Estimates',
      description: 'Create professional estimates in minutes, not hours',
      color: '#F0F015'
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Real-time Analytics',
      description: 'Make data-driven decisions with powerful insights',
      color: '#013BDB'
    }
  ]

  const testimonials = [
    {
      name: 'Mike Rodriguez',
      company: 'Rodriguez Construction Co.',
      quote: 'LynkuPro transformed how we manage projects. We\'ve increased efficiency by 40% in just 3 months.',
      rating: 5
    },
    {
      name: 'Sarah Chen',
      company: 'Chen Building Group',
      quote: 'The best construction CRM we\'ve used. Simple, powerful, and our team actually uses it!',
      rating: 5
    },
    {
      name: 'Tom Williams',
      company: 'Williams & Sons Contractors',
      quote: 'From bid to build, LynkuPro keeps everything organized. Can\'t imagine working without it.',
      rating: 5
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Active Projects' },
    { number: '500+', label: 'Companies Trust Us' },
    { number: '98%', label: 'Customer Satisfaction' },
    { number: '45%', label: 'Average Time Saved' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="animated-bg">
          <div className="gradient-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: 'calc(100vh - 200px)' }}>
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h1" 
                    component="h1"
                    sx={{ 
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 800,
                      color: '#FFFFFF !important',
                      lineHeight: 1.2,
                      mb: 1,
                      display: 'block',
                      visibility: 'visible'
                    }}
                    style={{ color: '#FFFFFF' }}
                  >
                    Build Better.
                  </Typography>
                  <Typography 
                    variant="h1" 
                    component="div"
                    sx={{ 
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 800,
                      lineHeight: 1.2,
                      background: 'linear-gradient(135deg, #F0F015 0%, #FFD700 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Manage Smarter.
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 300
                  }}
                >
                  The all-in-one CRM platform designed specifically for construction professionals. 
                  Streamline your workflow from first contact to final invoice.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    className="cta-button primary-cta"
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: '#F0F015',
                      color: '#013BDB',
                      '&:hover': {
                        backgroundColor: '#FFD700'
                      }
                    }}
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    className="cta-button secondary-cta"
                    startIcon={<PlayCircle />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="hero-image-container">
                <div className="dashboard-preview">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="dashboard-content">
                    <div className="stat-card stat-1">
                      <Analytics /> <span>Revenue</span>
                    </div>
                    <div className="stat-card stat-2">
                      <Construction /> <span>Projects</span>
                    </div>
                    <div className="stat-card stat-3">
                      <Groups /> <span>Team</span>
                    </div>
                  </div>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="h2" className="section-title animate-on-scroll" id="features-title">
              Everything You Need to
              <br />
              <span className="text-gradient">Run Your Business</span>
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={isVisible['features-title']} timeout={500 + index * 200}>
                  <Card className="feature-card">
                    <CardContent>
                      <Box 
                        className="feature-icon"
                        sx={{ backgroundColor: feature.color }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" className="feature-title">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" className="feature-description">
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

      {/* Stats Section */}
      <section className="stats-section">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box className="stat-item">
                  <Typography 
                    variant="h2" 
                    className="stat-number"
                    sx={{ 
                      color: '#F0F015 !important',
                      fontSize: '4rem !important',
                      fontWeight: '800 !important'
                    }}
                  >
                    <span className="count-up">{stat.number}</span>
                  </Typography>
                  <Typography 
                    variant="h6" 
                    className="stat-label"
                    sx={{ 
                      color: '#F0F015 !important',
                      fontSize: '1.25rem !important'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="benefits-image animate-on-scroll" id="benefits-image">
                <div className="image-stack">
                  <div className="stack-item stack-1"></div>
                  <div className="stack-item stack-2"></div>
                  <div className="stack-item stack-3"></div>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" className="section-subtitle">
                Why Construction Companies Choose LynkuPro
              </Typography>
              <Box className="benefits-list">
                {[
                  'Reduce project delays by 35% with better communication',
                  'Win more bids with professional estimates',
                  'Never miss a follow-up with automated reminders',
                  'Access your data anywhere, anytime',
                  'Integrate with tools you already use'
                ].map((benefit, index) => (
                  <Slide
                    direction="left"
                    in={isVisible['benefits-image']}
                    timeout={500 + index * 100}
                    key={index}
                  >
                    <Box className="benefit-item">
                      <CheckCircle sx={{ color: '#4CAF50', mr: 2 }} />
                      <Typography>{benefit}</Typography>
                    </Box>
                  </Slide>
                ))}
              </Box>
              <Button 
                variant="contained" 
                size="large"
                className="cta-button primary-cta"
                sx={{ mt: 4 }}
              >
                See All Features
              </Button>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container maxWidth="md">
          <Typography variant="h3" className="section-title" textAlign="center" mb={6}>
            Trusted by Industry Leaders
          </Typography>
          <Box className="testimonial-container">
            <Card className="testimonial-card">
              <CardContent>
                <Typography variant="h5" className="testimonial-quote">
                  "{testimonials[currentTestimonial].quote}"
                </Typography>
                <Box className="testimonial-author">
                  <Typography variant="h6">
                    {testimonials[currentTestimonial].name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonials[currentTestimonial].company}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Box className="testimonial-dots">
              {testimonials.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentTestimonial === index ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container maxWidth="lg">
          <Box className="cta-content">
            <Typography variant="h2" className="cta-title">
              Ready to Transform Your Business?
            </Typography>
            <Typography variant="h5" className="cta-subtitle">
              Join 500+ construction companies already using LynkuPro
            </Typography>
            <Box className="cta-features">
              <Box className="cta-feature">
                <Speed /> No credit card required
              </Box>
              <Box className="cta-feature">
                <Security /> Bank-level security
              </Box>
              <Box className="cta-feature">
                <Support /> 24/7 support
              </Box>
            </Box>
            <Button 
              variant="contained" 
              size="large"
              className="final-cta"
            >
              Start Your Free 14-Day Trial
            </Button>
          </Box>
        </Container>
      </section>
    </div>
  )
}

export default Home