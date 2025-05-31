import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Feature {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

const initialFeatures: Feature[] = [
  { id: 1, name: 'Beta Dashboard', description: 'New dashboard for beta users', enabled: true },
  { id: 2, name: 'Advanced Analytics', description: 'Enable advanced analytics for premium tenants', enabled: false },
];

function Features() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);

  // TODO: Add CRUD logic (API integration, dialogs, etc.)

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Feature Flags</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>Add Feature</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell>{feature.name}</TableCell>
                <TableCell>{feature.description}</TableCell>
                <TableCell>{feature.enabled ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary"><EditIcon /></IconButton>
                  <IconButton color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Features;
