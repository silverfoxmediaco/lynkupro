import React from 'react'
import { Container, Typography, Grid, Card, CardContent, Box, Button, Chip, TextField, InputAdornment } from '@mui/material'
import { Search, Article, VideoLibrary, Download, School, MenuBook, TrendingUp } from '@mui/icons-material'
import '../styles/Resources.css'

function Resources() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'guides', label: 'Guides' },
    { id: 'videos', label: 'Videos' },
    { id: 'templates', label: 'Templates' },
    { id: 'webinars', label: 'Webinars' },
    { id: 'case-studies', label: 'Case Studies' }
  ]

  const resources = [
    {
      id: 1,
      title: 'Getting Started with LynkUpPro',
      description: 'Complete guide to setting up your construction CRM and onboarding your team',
      category: 'guides',
      type: 'PDF Guide',
      icon: <Article />,
      duration: '15 min read',
      featured: true
    },
    {
      id: 2,
      title: 'Lead Management Best Practices',
      description: 'Learn how to effectively manage and convert construction leads',
      category: 'videos',
      type: 'Video Tutorial',
      icon: <VideoLibrary />,
      duration: '12 min video',
      featured: false
    },
    {
      id: 3,
      title: 'Project Estimate Template',
      description: 'Professional construction estimate template with automatic calculations',
      category: 'templates',
      type: 'Excel Template',
      icon: <Download />,
      duration: 'Download',
      featured: true
    },
    {
      id: 4,
      title: 'Maximizing ROI with CRM',
      description: 'Webinar on how construction companies can increase profits with CRM',
      category: 'webinars',
      type: 'Live Webinar',
      icon: <School />,
      duration: '45 min',
      featured: false
    },
    {
      id: 5,
      title: 'ABC Construction Success Story',
      description: 'How ABC Construction increased efficiency by 40% with LynkUpPro',
      category: 'case-studies',
      type: 'Case Study',
      icon: <TrendingUp />,
      duration: '10 min read',
      featured: true
    },
    {
      id: 6,
      title: 'Construction CRM Implementation Guide',
      description: 'Step-by-step guide to implementing CRM in your construction business',
      category: 'guides',
      type: 'PDF Guide',
      icon: <MenuBook />,
      duration: '20 min read',
      featured: false
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredResources = resources.filter(resource => resource.featured)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Resources & Learning Center
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Everything you need to succeed with LynkUpPro
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.label}
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                backgroundColor: selectedCategory === category.id ? '#013BDB' : '#F5F5F5',
                color: selectedCategory === category.id ? 'white' : '#2D2D2D',
                '&:hover': {
                  backgroundColor: selectedCategory === category.id ? '#0230b0' : '#e0e0e0'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {selectedCategory === 'all' && searchTerm === '' && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Featured Resources
          </Typography>
          <Grid container spacing={3}>
            {featuredResources.map((resource) => (
              <Grid item xs={12} md={4} key={resource.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '2px solid #F0F015',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    backgroundColor: '#F0F015', 
                    p: 3, 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(resource.icon, { sx: { fontSize: 48, color: '#013BDB' } })}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#013BDB' }}>
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {resource.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {resource.duration}
                      </Typography>
                      <Chip label={resource.type} size="small" />
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button fullWidth variant="contained" sx={{ backgroundColor: '#013BDB' }}>
                      Access Resource
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          {selectedCategory === 'all' ? 'All Resources' : categories.find(c => c.id === selectedCategory)?.label}
        </Typography>
        <Grid container spacing={3}>
          {filteredResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      backgroundColor: '#F5F5F5', 
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
                      <Chip label={resource.type} size="small" />
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#013BDB' }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {resource.duration}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button fullWidth variant="outlined">
                    View Resource
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ 
        backgroundColor: '#013BDB', 
        color: 'white',
        borderRadius: 3, 
        p: 4, 
        mt: 6,
        textAlign: 'center' 
      }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Need Personalized Training?
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          Our experts are here to help you get the most out of LynkUpPro
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            backgroundColor: '#F0F015',
            color: '#013BDB',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#d4d400' }
          }}
        >
          Schedule Training Session
        </Button>
      </Box>
    </Container>
  )
}

export default Resources