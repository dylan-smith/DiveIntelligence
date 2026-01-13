'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Tooltip } from '@mui/material';
import { useDivePlanner, BreathingGas } from '@/context/DivePlannerContext';

interface CustomGasInputProps {
  disabled?: boolean;
  onGasChanged: (gas: BreathingGas) => void;
}

export default function CustomGasInput({ disabled = false, onGasChanged }: CustomGasInputProps) {
  const { divePlanner } = useDivePlanner();
  
  const [oxygen, setOxygen] = useState(21);
  const [helium, setHelium] = useState(0);
  const [nitrogen, setNitrogen] = useState(79);

  useEffect(() => {
    const newNitrogen = 100 - oxygen - helium;
    setNitrogen(newNitrogen);
    const gas = BreathingGas.create(oxygen, helium, newNitrogen, divePlanner.settings);
    onGasChanged(gas);
  }, [oxygen, helium, divePlanner.settings, onGasChanged]);

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
      <TextField
        label="Oxygen (%)"
        type="number"
        value={oxygen}
        onChange={(e) => setOxygen(Number(e.target.value))}
        disabled={disabled}
        inputProps={{ min: 0, max: 100 }}
        size="small"
      />
      <TextField
        label="Helium (%)"
        type="number"
        value={helium}
        onChange={(e) => setHelium(Number(e.target.value))}
        disabled={disabled}
        inputProps={{ min: 0, max: 100 }}
        size="small"
      />
      <Tooltip title="The nitrogen value will be automatically calculated when you input the values for oxygen and helium">
        <TextField
          label="Nitrogen (%)"
          type="number"
          value={nitrogen}
          disabled
          size="small"
        />
      </Tooltip>
    </Box>
  );
}
