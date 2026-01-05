'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDivePlanner } from '@/context/DivePlannerContext';

export default function DiveSettings() {
  const { divePlanner, triggerUpdate } = useDivePlanner();
  const settings = divePlanner.settings;

  const [ascentRate, setAscentRate] = useState(settings.ascentRate);
  const [descentRate, setDescentRate] = useState(settings.descentRate);
  const [isOxygenNarcotic, setIsOxygenNarcotic] = useState(settings.isOxygenNarcotic);
  const [workingPO2Maximum, setWorkingPO2Maximum] = useState(settings.workingPO2Maximum);
  const [decoPO2Maximum, setDecoPO2Maximum] = useState(settings.decoPO2Maximum);
  const [pO2Minimum, setPO2Minimum] = useState(settings.pO2Minimum);
  const [ENDErrorThreshold, setENDErrorThreshold] = useState(settings.ENDErrorThreshold);

  const handleAscentRateChange = (value: number) => {
    setAscentRate(value);
    settings.ascentRate = value;
    triggerUpdate();
  };

  const handleDescentRateChange = (value: number) => {
    setDescentRate(value);
    settings.descentRate = value;
    triggerUpdate();
  };

  const handleOxygenNarcoticChange = (value: boolean) => {
    setIsOxygenNarcotic(value);
    settings.isOxygenNarcotic = value;
    triggerUpdate();
  };

  const handleWorkingPO2MaximumChange = (value: number) => {
    setWorkingPO2Maximum(value);
    settings.workingPO2Maximum = value;
    triggerUpdate();
  };

  const handleDecoPO2MaximumChange = (value: number) => {
    setDecoPO2Maximum(value);
    settings.decoPO2Maximum = value;
    triggerUpdate();
  };

  const handlePO2MinimumChange = (value: number) => {
    setPO2Minimum(value);
    settings.pO2Minimum = value;
    triggerUpdate();
  };

  const handleENDErrorThresholdChange = (value: number) => {
    setENDErrorThreshold(value);
    settings.ENDErrorThreshold = value;
    triggerUpdate();
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SettingsIcon />
        Dive Settings
      </Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Tooltip
            title="The maximum oxygen partial pressure during the working (i.e. non-deco) part of the dive. If any part of the dive plan exceeds this a warning will be shown. Default: 1.4"
            placement="right"
          >
            <TextField
              label="Working PO2 Maximum"
              type="number"
              value={workingPO2Maximum}
              onChange={(e) => handleWorkingPO2MaximumChange(Number(e.target.value))}
              inputProps={{ step: 0.1 }}
              size="small"
            />
          </Tooltip>
          <Tooltip
            title="The maximum oxygen partial pressure acceptable during deco stops. If any part of the dive plan exceeds this an error will be shown. Default: 1.6"
            placement="right"
          >
            <TextField
              label="Deco PO2 Maximum"
              type="number"
              value={decoPO2Maximum}
              onChange={(e) => handleDecoPO2MaximumChange(Number(e.target.value))}
              inputProps={{ step: 0.1 }}
              size="small"
            />
          </Tooltip>
          <Tooltip
            title="The minimum acceptable oxygen partial pressure. This is applicable when breathing hypoxic mixtures. Default: 0.18"
            placement="right"
          >
            <TextField
              label="Minimum PO2"
              type="number"
              value={pO2Minimum}
              onChange={(e) => handlePO2MinimumChange(Number(e.target.value))}
              inputProps={{ step: 0.01 }}
              size="small"
            />
          </Tooltip>
          <Tooltip
            title="If the equivalent narcotic depth (air) exceeds this value an error will be shown. Default: 30m"
            placement="right"
          >
            <TextField
              label="Maximum END (m)"
              type="number"
              value={ENDErrorThreshold}
              onChange={(e) => handleENDErrorThresholdChange(Number(e.target.value))}
              size="small"
            />
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Descent Rate (m/min)"
            type="number"
            value={descentRate}
            onChange={(e) => handleDescentRateChange(Number(e.target.value))}
            inputProps={{ min: 1 }}
            size="small"
          />
          <TextField
            label="Ascent Rate (m/min)"
            type="number"
            value={ascentRate}
            onChange={(e) => handleAscentRateChange(Number(e.target.value))}
            inputProps={{ min: 1 }}
            size="small"
          />
          <Tooltip
            title="If this is turned off only the Nitrogen content will be considered when calculating the equivalent narcotic depth (END). If enabled both Oxygen and Nitrogen will be included. Default: On"
            placement="right"
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isOxygenNarcotic}
                  onChange={(e) => handleOxygenNarcoticChange(e.target.checked)}
                />
              }
              label="Is Oxygen Narcotic?"
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
