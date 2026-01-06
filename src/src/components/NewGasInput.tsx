'use client';

import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useDivePlanner, BreathingGas } from '@/context/DivePlannerContext';

interface NewGasInputProps {
  onGasSelected: (gas: BreathingGas) => void;
}

export default function NewGasInput({ onGasSelected }: NewGasInputProps) {
  const { divePlanner } = useDivePlanner();
  const standardGases = BreathingGas.StandardGases;
  const currentDepth = divePlanner.getCurrentDepth();
  const optimalGas = divePlanner.getOptimalDecoGas(currentDepth);

  const [gasType, setGasType] = useState<'standard' | 'optimal' | 'custom'>('standard');
  const [selectedStandardGas, setSelectedStandardGas] = useState<string>(standardGases[0].name);
  const [oxygen, setOxygen] = useState(21);
  const [helium, setHelium] = useState(0);

  const handleGasTypeChange = (type: 'standard' | 'optimal' | 'custom') => {
    setGasType(type);
    if (type === 'standard') {
      const gas = standardGases.find(g => g.name === selectedStandardGas);
      if (gas) onGasSelected(gas);
    } else if (type === 'optimal') {
      onGasSelected(optimalGas);
    } else {
      const nitrogen = 100 - oxygen - helium;
      onGasSelected(BreathingGas.create(oxygen, helium, nitrogen, divePlanner.settings));
    }
  };

  const handleStandardGasChange = (name: string) => {
    setSelectedStandardGas(name);
    const gas = standardGases.find(g => g.name === name);
    if (gas) onGasSelected(gas);
  };

  const handleCustomGasChange = (o2: number, he: number) => {
    setOxygen(o2);
    setHelium(he);
    const nitrogen = 100 - o2 - he;
    onGasSelected(BreathingGas.create(o2, he, nitrogen, divePlanner.settings));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Gas Type</InputLabel>
        <Select
          value={gasType}
          label="Gas Type"
          onChange={(e) => handleGasTypeChange(e.target.value as 'standard' | 'optimal' | 'custom')}
        >
          <MenuItem value="standard">Standard Gas</MenuItem>
          <MenuItem value="optimal">Optimal Deco Gas</MenuItem>
          <MenuItem value="custom">Custom Gas</MenuItem>
        </Select>
      </FormControl>

      {gasType === 'standard' && (
        <FormControl fullWidth>
          <InputLabel>Standard Gas</InputLabel>
          <Select
            value={selectedStandardGas}
            label="Standard Gas"
            onChange={(e) => handleStandardGasChange(e.target.value)}
          >
            {standardGases.map((gas) => (
              <MenuItem key={gas.name} value={gas.name}>
                {gas.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {gasType === 'optimal' && (
        <Typography>
          Optimal gas for {currentDepth}m:{' '}
          <strong dangerouslySetInnerHTML={{ __html: optimalGas.description }} />
        </Typography>
      )}

      {gasType === 'custom' && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Oxygen (%)"
            type="number"
            value={oxygen}
            onChange={(e) => handleCustomGasChange(Number(e.target.value), helium)}
            inputProps={{ min: 0, max: 100 }}
            size="small"
          />
          <TextField
            label="Helium (%)"
            type="number"
            value={helium}
            onChange={(e) => handleCustomGasChange(oxygen, Number(e.target.value))}
            inputProps={{ min: 0, max: 100 }}
            size="small"
          />
          <TextField
            label="Nitrogen (%)"
            type="number"
            value={100 - oxygen - helium}
            disabled
            size="small"
          />
        </Box>
      )}
    </Box>
  );
}
