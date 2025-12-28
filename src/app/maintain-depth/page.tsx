'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import Link from 'next/link';
import CurrentStats from '../components/CurrentStats';
import NewTimeStats from '../components/NewTimeStats';
import CeilingChart from '../components/CeilingChart';
import { useDivePlanner, useAddMaintainDepthSegment } from '../contexts/DivePlannerContext';

export default function MaintainDepthPage() {
  const router = useRouter();
  const { divePlanner } = useDivePlanner();
  const addMaintainDepthSegment = useAddMaintainDepthSegment();
  const [timeAtDepth, setTimeAtDepth] = useState(0);

  const handleTimeAtDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setTimeAtDepth(value);
  };

  const handleSave = () => {
    addMaintainDepthSegment(timeAtDepth * 60);
    router.push('/dive-overview');
  };

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 900 }}>
        <CurrentStats />
        <Typography variant="h5" sx={{ my: 2 }}>Select time at depth</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <TextField
                label="Time at Depth (mins)"
                type="number"
                value={timeAtDepth}
                onChange={handleTimeAtDepthChange}
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Paper>
            <NewTimeStats timeAtDepth={timeAtDepth} />
          </Box>
          <Box sx={{ flex: '2 1 500px' }}>
            <CeilingChart timeAtDepth={timeAtDepth} />
          </Box>
        </Box>
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
