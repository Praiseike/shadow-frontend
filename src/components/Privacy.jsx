import { Container, Typography, Box, Paper } from '@mui/material';
import Layout from './Layout';

const Privacy = () => {
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
            Privacy Policy
          </Typography>

          <Typography variant="h6" sx={{
            color: '#64748b',
            mb: 6,
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            Last updated: October 27, 2024
          </Typography>

          <Box sx={{ color: '#334155', lineHeight: 1.8 }}>
            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, and social media account information.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We use the information we collect to:
            </Typography>
            <Box sx={{ pl: 4, mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Provide, maintain, and improve our services</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Process transactions and send related information</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Send technical notices, updates, security alerts, and support messages</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Respond to your comments, questions, and requests</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Communicate with you about products, services, offers, and events</Typography>
            </Box>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              3. Information Sharing
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information in the following circumstances:
            </Typography>
            <Box sx={{ pl: 4, mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• With service providers who assist us in operating our platform</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• When required by law or to protect our rights</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• In connection with a business transfer or bankruptcy</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• With your explicit consent</Typography>
            </Box>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              4. Data Security
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              5. Social Media Integration
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              When you connect your social media accounts, we use secure OAuth connections. We never store your social media passwords. We only access the information necessary to provide our services and post content on your behalf.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              6. AI Content Generation
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              Content generated by our AI is based on your profile information and selected topics. We do not use your personal data to train our AI models or share it with third parties for training purposes.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              7. Data Retention
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              8. Your Rights
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </Typography>
            <Box sx={{ pl: 4, mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Access to your personal information</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Correction of inaccurate information</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Deletion of your personal information</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Restriction or objection to processing</Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '0.95rem' }}>• Data portability</Typography>
            </Box>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              9. Cookies and Tracking
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookie settings through your browser preferences.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              10. International Data Transfers
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your personal information during such transfers.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              11. Children's Privacy
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              12. Changes to This Policy
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </Typography>

            <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 2, mt: 4, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              13. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '0.95rem' }}>
              If you have any questions about this Privacy Policy, please contact us at privacy@autopost.ai.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Privacy;