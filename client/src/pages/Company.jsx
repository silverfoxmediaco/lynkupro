import React from 'react'
import { Container, Typography } from '@mui/material'
import '../styles/Company.css'

function Company() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" color="primary" gutterBottom>
        Company
      </Typography>
      <Typography variant="body1">
        Welcome to the Company page.
      </Typography>
    </Container>
  )
}

export default Company