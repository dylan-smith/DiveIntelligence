'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { useDivePlanner } from '@/context/DivePlannerContext';
import CurrentStats from '@/components/CurrentStats';
import NewTimeStats from '@/components/NewTimeStats';
import CeilingChart from '@/components/charts/CeilingChart';

export default function MaintainDepthPage() {
  const router = useRouter();
  const { divePlanner, triggerUpdate } = useDivePlanner();
  const [isReady, setIsReady] = useState(false);
  const [timeAtDepth, setTimeAtDepth] = useState(0);

  useEffect(() => {
    if (divePlanner.getDiveSegments().length > 0) {
      setIsReady(true);
    } else {
      router.push('/');
    }
  }, [divePlanner, router]);

  const handleSave = () => {
    divePlanner.addMaintainDepthSegment(timeAtDepth * 60);
    triggerUpdate();
    router.push('/dive-overview');
  };

  if (!isReady) {
    return null;
  }

  return (
    <Box component="main" sx={{ p: 2 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <CurrentStats />
        </Paper>
        
        <Typography variant="h5" sx={{ mb: 2 }}>
          How long to stay at this depth?
        </Typography>
        
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <TextField
            label="Time at Depth (minutes)"
            type="number"
            value={timeAtDepth}
            onChange={(e) => setTimeAtDepth(Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
          />
        </Paper>

        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <NewTimeStats timeAtDepth={timeAtDepth} />
        </Paper>

        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <CeilingChart timeAtDepth={timeAtDepth} />
        </Paper>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button
            component={Link}
            href="/dive-overview"
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
