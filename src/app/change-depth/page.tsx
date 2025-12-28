'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import Link from 'next/link';
import CurrentStats from '../components/CurrentStats';
import NewDepthStats from '../components/NewDepthStats';
import { useDivePlanner, useAddChangeDepthSegment } from '../contexts/DivePlannerContext';

export default function ChangeDepthPage() {
  const router = useRouter();
  const { divePlanner } = useDivePlanner();
  const addChangeDepthSegment = useAddChangeDepthSegment();

  const initialDepth = useMemo(() => {
    if (divePlanner && divePlanner.getDiveSegments().length > 0) {
      return divePlanner.getCurrentDepth();
    }
    return 0;
  }, [divePlanner]);

  const [newDepth, setNewDepth] = useState<number>(initialDepth);

  const handleNewDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setNewDepth(value);
  };

  const handleSave = () => {
    addChangeDepthSegment(newDepth);
    router.push('/dive-overview');
  };

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 600 }}>
        <CurrentStats />
        <Typography variant="h5" sx={{ my: 2 }}>Select new depth</Typography>
        <Box sx={{ mb: 2 }}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <TextField
              label="New Depth (m)"
              type="number"
              value={newDepth}
              onChange={handleNewDepthChange}
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Paper>
        </Box>
        <NewDepthStats newDepth={newDepth} />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" component={Link} href="/dive-overview">
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
