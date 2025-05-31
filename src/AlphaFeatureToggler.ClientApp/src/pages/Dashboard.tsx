import { Box, Typography } from '@mui/material';

export default function Dashboard() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>
        Welcome to your SaaS Feature Flag Dashboard! Here you can see overall progress, feature usage, and tenant-specific stats.
      </Typography>
    </Box>
  );
}
