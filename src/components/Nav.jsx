import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const Nav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <nav style={{
      background: 'rgba(15, 12, 41, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Container maxWidth="lg">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <AutoAwesomeIcon sx={{ color: '#667eea', fontSize: 32 }} />
            <Typography variant="h4" component="h1" sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              PostNexus
            </Typography>
          </div>

          {!isMobile && (
            <div className="flex items-center space-x-8">
              <a href="#features" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Features</a>
              <a href="#pricing" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Pricing</a>
              <a href="#testimonials" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Testimonials</a>
              <a href="#faq" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#667eea'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>FAQ</a>
              <Link to="/auth">
                <Button variant="contained" sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s'
                }}>
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {isMobile && (
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} sx={{ color: 'white' }}>
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </div>

        {isMobile && mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(15, 12, 41, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div className="flex flex-col space-y-4 p-6">
              <a href="#features" style={{ color: 'rgba(255,255,255,0.8)' }} onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" style={{ color: 'rgba(255,255,255,0.8)' }} onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#testimonials" style={{ color: 'rgba(255,255,255,0.8)' }} onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <a href="#faq" style={{ color: 'rgba(255,255,255,0.8)' }} onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="contained" fullWidth sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mt: 2
                }}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Nav;