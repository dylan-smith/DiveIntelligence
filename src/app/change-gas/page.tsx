'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import CurrentStats from '../components/CurrentStats';
import NewGasInput from '../components/NewGasInput';
import NewGasStats from '../components/NewGasStats';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner, useAddChangeGasSegment } from '../contexts/DivePlannerContext';

export default function ChangeGasPage() {
  const router = useRouter();
  const { divePlanner } = useDivePlanner();
  const addChangeGasSegment = useAddChangeGasSegment();
  const [newGas, setNewGas] = useState<BreathingGas | null>(null);

  useEffect(() => {
    if (!newGas && divePlanner) {
      setNewGas(divePlanner.getCurrentGas());
    }
  }, [divePlanner, newGas]);

  const handleNewGasSelected = useCallback((gas: BreathingGas) => {
    setNewGas(gas);
  }, []);

  const handleSave = () => {
    if (newGas) {
      addChangeGasSegment(newGas);
      router.push('/dive-overview');
    }
  };

  if (!newGas) {
    return <Box component="main" sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 800 }}>
        <CurrentStats />
        <Typography variant="h5" sx={{ my: 2 }}>Select new gas</Typography>
        <NewGasInput onNewGasSelected={handleNewGasSelected} />
        <Box sx={{ mt: 2 }}>
          <NewGasStats newGas={newGas} />
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
