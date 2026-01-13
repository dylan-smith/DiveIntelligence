'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { useDivePlanner } from '@/context/DivePlannerContext';
import CurrentStats from '@/components/CurrentStats';
import NewDepthStats from '@/components/NewDepthStats';

export default function ChangeDepthPage() {
  const router = useRouter();
  const { divePlanner, triggerUpdate, updateTrigger } = useDivePlanner();
  const [isReady, setIsReady] = useState(false);
  const [newDepth, setNewDepth] = useState(0);

  useEffect(() => {
    // Check if dive is started (has more than 0 segments)
    if (divePlanner.getDiveSegments().length > 0) {
      setNewDepth(divePlanner.getCurrentDepth());
      setIsReady(true);
    } else {
      router.push('/');
    }
  }, [divePlanner, router]);

  const handleSave = () => {
    divePlanner.addChangeDepthSegment(newDepth);
    triggerUpdate();
    router.push('/dive-overview');
  };

  if (!isReady) {
    return null;
  }

  return (
    <Box component="main" sx={{ p: 2 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <CurrentStats />
        </Paper>
        
        <Typography variant="h5" sx={{ mb: 2 }}>
          Select new depth
        </Typography>
        
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <TextField
            label="New Depth (m)"
            type="number"
            value={newDepth}
            onChange={(e) => setNewDepth(Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
          />
        </Paper>

        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <NewDepthStats newDepth={newDepth} />
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
