'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Box, Tooltip } from '@mui/material';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner } from '../contexts/DivePlannerContext';

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

  const handleOxygenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
    setOxygen(value);
  };

  const handleHeliumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
    setHelium(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <TextField
        label="Oxygen (%)"
        type="number"
        value={oxygen}
        onChange={handleOxygenChange}
        disabled={disabled}
        inputProps={{ min: 0, max: 100 }}
        size="small"
      />
      <TextField
        label="Helium (%)"
        type="number"
        value={helium}
        onChange={handleHeliumChange}
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
