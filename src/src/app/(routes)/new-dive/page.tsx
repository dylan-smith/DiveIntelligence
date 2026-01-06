'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Paper,
} from '@mui/material';
import { useDivePlanner, BreathingGas } from '@/context/DivePlannerContext';
import StandardGasList from '@/components/StandardGasList';
import CustomGasInput from '@/components/CustomGasInput';
import DiveSettings from '@/components/DiveSettings';
import StartGasStats from '@/components/StartGasStats';

export default function NewDivePage() {
  const router = useRouter();
  const { divePlanner, triggerUpdate } = useDivePlanner();

  const [gasType, setGasType] = useState<'standard' | 'custom'>('standard');
  const [selectedStandardGas, setSelectedStandardGas] = useState<BreathingGas>(
    BreathingGas.StandardGases[0]
  );
  const [customGas, setCustomGas] = useState<BreathingGas>(
    BreathingGas.create(21, 0, 79, divePlanner.settings)
  );

  const getSelectedGas = () => {
    return gasType === 'standard' ? selectedStandardGas : customGas;
  };

  const handleSave = () => {
    divePlanner.startDive(getSelectedGas());
    triggerUpdate();
    router.push('/dive-overview');
  };

  return (
    <Box component="main" sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" id="select-starting-gas-heading" sx={{ mb: 3 }}>
        Select the starting gas for the dive
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup
          aria-labelledby="select-starting-gas-heading"
          value={gasType}
          onChange={(e) => setGasType(e.target.value as 'standard' | 'custom')}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <FormControlLabel
                value="standard"
                control={<Radio />}
                label="Standard gas"
              />
              <Paper elevation={2} sx={{ p: 2, mt: 1 }}>
                <StandardGasList
                  disabled={gasType === 'custom'}
                  onGasSelected={setSelectedStandardGas}
                />
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label="Custom gas"
                />
                <CustomGasInput
                  disabled={gasType === 'standard'}
                  onGasChanged={setCustomGas}
                />
              </Box>
              <Paper elevation={2} sx={{ p: 2 }}>
                <DiveSettings />
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <StartGasStats gas={getSelectedGas()} />
              </Paper>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
