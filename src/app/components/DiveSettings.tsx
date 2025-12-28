'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Tooltip,
  Paper,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDivePlanner } from '../contexts/DivePlannerContext';

export default function DiveSettings() {
  const { divePlanner, updateSetting } = useDivePlanner();
  const settings = divePlanner.settings;

  const [ascentRate, setAscentRate] = useState(settings.ascentRate);
  const [descentRate, setDescentRate] = useState(settings.descentRate);
  const [isOxygenNarcotic, setIsOxygenNarcotic] = useState(settings.isOxygenNarcotic);
  const [workingPO2Maximum, setWorkingPO2Maximum] = useState(settings.workingPO2Maximum);
  const [decoPO2Maximum, setDecoPO2Maximum] = useState(settings.decoPO2Maximum);
  const [pO2Minimum, setPO2Minimum] = useState(settings.pO2Minimum);
  const [ENDErrorThreshold, setENDErrorThreshold] = useState(settings.ENDErrorThreshold);

  const handleDescentRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setDescentRate(value);
    updateSetting('descentRate', value);
  };

  const handleAscentRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setAscentRate(value);
    updateSetting('ascentRate', value);
  };

  const handleOxygenNarcoticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setIsOxygenNarcotic(value);
    updateSetting('isOxygenNarcotic', value);
  };

  const handleWorkingPO2MaximumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 1.4;
    setWorkingPO2Maximum(value);
    updateSetting('workingPO2Maximum', value);
  };

  const handleDecoPO2MaximumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 1.6;
    setDecoPO2Maximum(value);
    updateSetting('decoPO2Maximum', value);
  };

  const handlePO2MinimumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0.18;
    setPO2Minimum(value);
    updateSetting('pO2Minimum', value);
  };

  const handleENDErrorThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 30;
    setENDErrorThreshold(value);
    updateSetting('ENDErrorThreshold', value);
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SettingsIcon />
        Dive Settings
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Tooltip title="The maximum oxygen partial pressure during the working (i.e. non-deco) part of the dive. If any part of the dive plan exceeds this a warning will be shown. Default: 1.4" placement="right">
            <TextField
              label="Working PO2 Maximum"
              type="number"
              value={workingPO2Maximum}
              onChange={handleWorkingPO2MaximumChange}
              inputProps={{ step: 0.1 }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="The maximum oxygen partial pressure acceptable during deco stops. If any part of the dive plan exceeds this an error will be shown. Default: 1.6" placement="right">
            <TextField
              label="Deco PO2 Maximum"
              type="number"
              value={decoPO2Maximum}
              onChange={handleDecoPO2MaximumChange}
              inputProps={{ step: 0.1 }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="The minimum acceptable oxygen partial pressure. This is applicable when breathing hypoxic mixtures. Default: 0.18" placement="right">
            <TextField
              label="Minimum PO2"
              type="number"
              value={pO2Minimum}
              onChange={handlePO2MinimumChange}
              inputProps={{ step: 0.01 }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="If the equivalent narcotic depth (air) exceeds this value an error will be shown. Default: 30m" placement="right">
            <TextField
              label="Maximum END (m)"
              type="number"
              value={ENDErrorThreshold}
              onChange={handleENDErrorThresholdChange}
              size="small"
            />
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Descent Rate (m/min)"
            type="number"
            value={descentRate}
            onChange={handleDescentRateChange}
            inputProps={{ min: 1 }}
            size="small"
          />
          <TextField
            label="Ascent Rate (m/min)"
            type="number"
            value={ascentRate}
            onChange={handleAscentRateChange}
            inputProps={{ min: 1 }}
            size="small"
          />
          <Tooltip title="If this is turned off only the Nitrogen content will be considered when calculating the equivalent narcotic depth (END). If enabled both Oxygen and Nitrogen will be included. Default: On" placement="right">
            <FormControlLabel
              control={
                <Switch
                  checked={isOxygenNarcotic}
                  onChange={handleOxygenNarcoticChange}
                />
              }
              label="Is Oxygen Narcotic?"
            />
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
}
