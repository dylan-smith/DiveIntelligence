'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Paper,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CustomGasInput from './CustomGasInput';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner } from '../contexts/DivePlannerContext';

interface NewGasInputProps {
  onNewGasSelected: (gas: BreathingGas) => void;
}

export default function NewGasInput({ onNewGasSelected }: NewGasInputProps) {
  const { divePlanner } = useDivePlanner();
  const settings = divePlanner.settings;

  const [newGasSelectedOption, setNewGasSelectedOption] = useState('current');
  const [standardGasIndex, setStandardGasIndex] = useState<number | ''>('');
  const [customGas, setCustomGas] = useState<BreathingGas>(
    BreathingGas.create(21, 0, 79, settings)
  );

  const currentGas = divePlanner.getCurrentGas();
  const StandardGases = divePlanner.getStandardGases();
  const optimalGas = divePlanner.getOptimalDecoGas(divePlanner.getCurrentDepth());

  const calculateNewGas = useCallback((option: string, stdGasIndex: number | '', custGas: BreathingGas) => {
    let newGas = currentGas;

    if (option === 'standard' && stdGasIndex !== '' && StandardGases[stdGasIndex]) {
      newGas = StandardGases[stdGasIndex];
    } else if (option === 'custom') {
      newGas = custGas;
    } else if (option === 'optimal') {
      newGas = optimalGas;
    }

    onNewGasSelected(newGas);
  }, [currentGas, StandardGases, optimalGas, onNewGasSelected]);

  const handleGasTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = event.target.value;
    setNewGasSelectedOption(option);
    calculateNewGas(option, standardGasIndex, customGas);
  };

  const handleStandardGasChange = (event: SelectChangeEvent<number | ''>) => {
    const index = event.target.value as number;
    setStandardGasIndex(index);
    calculateNewGas(newGasSelectedOption, index, customGas);
  };

  const handleCustomGasChanged = useCallback((gas: BreathingGas) => {
    setCustomGas(gas);
    if (newGasSelectedOption === 'custom') {
      onNewGasSelected(gas);
    }
  }, [newGasSelectedOption, onNewGasSelected]);

  const isStandardGasDisabled = newGasSelectedOption !== 'standard';
  const isCustomGasDisabled = newGasSelectedOption !== 'custom';

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <FormControl component="fieldset">
        <RadioGroup value={newGasSelectedOption} onChange={handleGasTypeChange}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                value="current"
                control={<Radio />}
                label={
                  <Box>
                    <div>Current Gas</div>
                    <Typography variant="body2" color="textSecondary" dangerouslySetInnerHTML={{ __html: currentGas.description }} />
                  </Box>
                }
              />
              <Tooltip title={`The gas with the maximum O2 while staying under ${settings.decoPO2Maximum} PO2, and the minimum Helium while staying at an END (Equivalent Narcotic Depth) of <= ${settings.ENDErrorThreshold}m`}>
                <FormControlLabel
                  value="optimal"
                  control={<Radio />}
                  label={
                    <Box>
                      <div>Optimal Deco Gas</div>
                      <Typography variant="body2" color="textSecondary" dangerouslySetInnerHTML={{ __html: optimalGas.description }} />
                    </Box>
                  }
                />
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel value="standard" control={<Radio />} label="Standard Gas" />
              <Select
                value={standardGasIndex}
                onChange={handleStandardGasChange}
                disabled={isStandardGasDisabled}
                displayEmpty
                size="small"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="" disabled>Select a gas</MenuItem>
                {StandardGases.map((gas, index) => (
                  <MenuItem key={index} value={index}>
                    <Box>
                      <div>{gas.name}</div>
                      <Typography variant="body2" color="textSecondary" dangerouslySetInnerHTML={{ __html: gas.compositionDescription }} />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel value="custom" control={<Radio />} label="Custom gas" />
              <CustomGasInput
                disabled={isCustomGasDisabled}
                onGasChanged={handleCustomGasChanged}
              />
            </Box>
          </Box>
        </RadioGroup>
      </FormControl>
    </Paper>
  );
}
