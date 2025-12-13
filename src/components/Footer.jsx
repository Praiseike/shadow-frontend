import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  IconButton,
  Grid,
  Box
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Business as BusinessIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const Footer = () => {
  return (
    <footer style={{
      position: 'relative',
      zIndex: 1,
      background: 'rgba(15, 12, 41, 0.8)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      paddingTop: '80px',
      paddingBottom: '40px'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AutoAwesomeIcon sx={{ color: '#667eea', fontSize: 36 }} />
              <Typography variant="h4" sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                PostNexus
              </Typography>
            </Box>
            <Typography variant="body2" sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 3,
              lineHeight: 1.8
            }}>
              AI-powered social media automation for professionals who want to grow their online presence without the hassle.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton sx={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.3)'
                }
              }}>
                <BusinessIcon />
              </IconButton>
              <IconButton sx={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.3)'
                }
              }}>
                <PeopleIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: 'white',
              mb: 3
            }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <a href="#features" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Features
              </a>
              <a href="#pricing" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Pricing
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                API
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Integrations
              </a>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: 'white',
              mb: 3
            }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                About
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Blog
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Careers
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Contact
              </a>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: 'white',
              mb: 3
            }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Help Center
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Documentation
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Community
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Status
              </a>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: 'white',
              mb: 3
            }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link to="/privacy" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Privacy
              </Link>
              <Link to="/terms" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Terms
              </Link>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Security
              </a>
              <a href="#" style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Cookies
              </a>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          mt: 8,
          pt: 6,
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            © {new Date().getFullYear()} PostNexus. All rights reserved. Made with ❤️ for creators.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;