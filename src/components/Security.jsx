import { Container, Typography, Box, Paper } from '@mui/material';
import Layout from './Layout';

const Security = () => {
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
            Security Policy
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
              1. Our Security Commitment
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              At PostNexus, we take the security of your data extremely seriously. We design our systems with security first in mind to ensure your accounts, credentials, and published content remain safe and secure.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              2. OAuth Connections
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We connect to your social media accounts (such as LinkedIn) exclusively via secure OAuth 2.0 protocols. PostNexus never requests, sees, or stores your social media passwords. You can revoke access at any time directly through the respective social network's security settings.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              3. Data Encryption
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              All data transmitted to and from PostNexus is encrypted in transit using Transport Layer Security (TLS/HTTPS). Critical stored credentials (like OAuth access tokens) are encrypted at rest using industry-standard AES-256 encryption.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              4. Third-Party Audits & Compliance
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We regularly monitor and audit our infrastructure for security vulnerabilities. Our services run on secure, cloud-hosted enterprise infrastructure designed to maintain resilience and high availability.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              5. Contact Our Security Team
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              If you discover or suspect a security vulnerability, please report it immediately to security@autopost.ai. We will investigate and respond to security disclosures promptly.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Security;
