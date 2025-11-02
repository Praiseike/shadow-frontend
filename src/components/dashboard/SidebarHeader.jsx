import { Box, Typography } from '@mui/material';

const SidebarHeader = () => {
  return (
    <Box sx={{
      p: 3,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)'
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
        PostNexus
      </Typography>
    </Box>
  );
};

export default SidebarHeader;