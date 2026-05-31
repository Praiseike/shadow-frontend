import { Container, Typography, Box, Paper } from '@mui/material';
import Layout from './Layout';

const Cookies = () => {
  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper 
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
          }}
        >
          <Typography variant="h2" sx={{
            color: '#0f172a',
            fontWeight: 800,
            mb: 2,
            textAlign: 'center',
            fontSize: { xs: '2.25rem', md: '3rem' },
            letterSpacing: '-1px'
          }}>
            Cookie Policy
          </Typography>

          <Typography variant="h6" sx={{
            color: '#64748b',
            mb: 6,
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            Last updated: May 31, 2026
          </Typography>

          <Box sx={{ color: '#334155', lineHeight: 1.8 }}>
            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              1. What Are Cookies?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              Cookies are small text files stored on your device when you access websites. We use cookies to enable key features, track platform analytics, and personalize your overall experience.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              2. Essential Cookies
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              These cookies are necessary for the website to function properly. We use them to keep you logged in to your account, secure your sessions, and store your preferences. You cannot disable these cookies in our system.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              3. Analytics Cookies
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We use analytics tools to collect information about how users interact with our platform. This helps us understand which pages are visited most often and identify areas for improvement. All analytical data is aggregated and anonymized.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              4. Managing Your Cookies
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              Most web browsers allow you to control cookies through their settings settings. If you choose to block all cookies, please note that parts of the PostNexus platform may not function correctly.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              5. Questions and Contacts
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              If you have any questions or feedback about our use of cookies, please reach out to us at privacy@autopost.ai.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Cookies;
