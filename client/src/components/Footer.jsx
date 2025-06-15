import React from 'react'
import { Box, Container, Typography } from '@mui/material'
import '../styles/Footer.css'

function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#F5F5F5', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © 2024 LynkUpPro. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer