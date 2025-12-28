'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Paper,
} from '@mui/material';
import StandardGasList from '../components/StandardGasList';
import CustomGasInput from '../components/CustomGasInput';
import DiveSettings from '../components/DiveSettings';
import StartGasStats from '../components/StartGasStats';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner, useStartDive } from '../contexts/DivePlannerContext';

export default function NewDivePage() {
  const router = useRouter();
  const { divePlanner } = useDivePlanner();
  const startDive = useStartDive();
  const [gasType, setGasType] = useState('standard');
  const [selectedStandardGas, setSelectedStandardGas] = useState<BreathingGas | null>(null);
  const [customGas, setCustomGas] = useState<BreathingGas | null>(null);

  useEffect(() => {
    const gases = divePlanner.getStandardGases();
    if (gases.length > 0 && !selectedStandardGas) {
      setSelectedStandardGas(gases[0]);
    }
    if (!customGas) {
      setCustomGas(BreathingGas.create(21, 0, 79, divePlanner.settings));
    }
  }, [divePlanner, selectedStandardGas, customGas]);

  const handleGasTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGasType(event.target.value);
  };

  const handleStandardGasSelected = useCallback((gas: BreathingGas) => {
    setSelectedStandardGas(gas);
  }, []);

  const handleCustomGasChanged = useCallback((gas: BreathingGas) => {
    setCustomGas(gas);
  }, []);

  const getSelectedGas = () => {
    if (gasType === 'standard') {
      return selectedStandardGas;
    }
    return customGas;
  };

  const handleSave = () => {
    const selectedGas = getSelectedGas();
    if (selectedGas) {
      startDive(selectedGas);
      router.push('/dive-overview');
    }
  };

  const selectedGas = getSelectedGas();

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" id="select-starting-gas-heading" sx={{ mb: 3 }}>
        Select the starting gas for the dive
      </Typography>
      <RadioGroup
        aria-labelledby="select-starting-gas-heading"
        value={gasType}
        onChange={handleGasTypeChange}
      >
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <FormControlLabel value="standard" control={<Radio />} label="Standard gas" />
            <StandardGasList
              disabled={gasType !== 'standard'}
              onGasSelected={handleStandardGasSelected}
            />
          </Box>
          <Box>
            <Box>
              <FormControlLabel value="custom" control={<Radio />} label="Custom gas" />
              <Paper elevation={2}>
                <CustomGasInput
                  disabled={gasType !== 'custom'}
                  onGasChanged={handleCustomGasChanged}
                />
              </Paper>
            </Box>
            <Box sx={{ mt: 2 }}>
              <DiveSettings />
            </Box>
          </Box>
          <Box>
            {selectedGas && <StartGasStats gas={selectedGas} />}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </RadioGroup>
    </Box>
  );
}
