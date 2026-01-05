'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { useDivePlanner, BreathingGas } from '@/context/DivePlannerContext';
import CurrentStats from '@/components/CurrentStats';
import NewGasInput from '@/components/NewGasInput';
import NewGasStats from '@/components/NewGasStats';

export default function ChangeGasPage() {
  const router = useRouter();
  const { divePlanner, triggerUpdate } = useDivePlanner();
  const [isReady, setIsReady] = useState(false);
  const [newGas, setNewGas] = useState<BreathingGas | null>(null);

  useEffect(() => {
    if (divePlanner.getDiveSegments().length > 0) {
      setNewGas(divePlanner.getCurrentGas());
      setIsReady(true);
    } else {
      router.push('/');
    }
  }, [divePlanner, router]);

  const handleSave = () => {
    if (newGas) {
      divePlanner.addChangeGasSegment(newGas);
      triggerUpdate();
      router.push('/dive-overview');
    }
  };

  if (!isReady || !newGas) {
    return null;
  }

  return (
    <Box component="main" sx={{ p: 2 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <CurrentStats />
        </Paper>
        
        <Typography variant="h5" sx={{ mb: 2 }}>
          Select new gas
        </Typography>
        
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <NewGasInput onGasSelected={setNewGas} />
        </Paper>

        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <NewGasStats gas={newGas} />
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
