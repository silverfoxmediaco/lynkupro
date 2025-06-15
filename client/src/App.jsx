import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Header from './components/Header'
import Footer from './components/Footer'
import Company from './pages/Company'
import Support from './pages/Support'
import Product from './pages/Product'
import Integrations from './pages/Integrations'
import Resources from './pages/Resources'

const theme = createTheme({
  palette: {
    primary: {
      main: '#013BDB',
    },
    secondary: {
      main: '#261FB3',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/company" element={<Company />} />
            <Route path="/support" element={<Support />} />
            <Route path="/product" element={<Product />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App