import { useState } from 'react';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDivePlanner, useDivePlannerStore } from '../dive-planner-service/dive-planner.store';
import './DiveSettings.css';

export function DiveSettings() {
  const planner = useDivePlanner();
  const updateSettings = useDivePlannerStore(s => s.updateSettings);

  const [workingPO2Maximum, setWorkingPO2Maximum] = useState(String(planner.settings.workingPO2Maximum));
  const [decoPO2Maximum, setDecoPO2Maximum] = useState(String(planner.settings.decoPO2Maximum));
  const [pO2Minimum, setPO2Minimum] = useState(String(planner.settings.pO2Minimum));
  const [ENDErrorThreshold, setENDErrorThreshold] = useState(String(planner.settings.ENDErrorThreshold));
  const [descentRate, setDescentRate] = useState(String(planner.settings.descentRate));
  const [ascentRate, setAscentRate] = useState(String(planner.settings.ascentRate));
  const [isOxygenNarcotic, setIsOxygenNarcotic] = useState(planner.settings.isOxygenNarcotic);

  const numberSetting =
    (setLocal: (value: string) => void, apply: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLocal(e.target.value);
      const value = Number(e.target.value);
      if (e.target.value !== '' && !Number.isNaN(value)) {
        apply(value);
      }
    };

  return (
    <div className="dive-dive-settings">
      <div className="dive-settings">
        <h2>
          <Icon>settings</Icon> Dive Settings
        </h2>
        <div className="dive-settings-row">
          <div className="dive-settings-col">
            <Tooltip
              title="The maximum oxygen partial pressure during the working (i.e. non-deco) part of the dive. If any part of the dive plan exceeds this a warning will be shown. Default: 1.4"
              placement="right">
              <TextField
                variant="filled"
                className="settings-input"
                label="Working PO2 Maximum"
                type="number"
                slotProps={{ htmlInput: { step: 0.1 } }}
                value={workingPO2Maximum}
                onChange={numberSetting(setWorkingPO2Maximum, v => updateSettings({ workingPO2Maximum: v }))}
              />
            </Tooltip>
            <Tooltip
              title="The maximum oxygen partial pressure acceptable during deco stops. If any part of the dive plan exceeds this an error will be shown. Default: 1.6"
              placement="right">
              <TextField
                variant="filled"
                className="settings-input"
                label="Deco PO2 Maximum"
                type="number"
                slotProps={{ htmlInput: { step: 0.1 } }}
                value={decoPO2Maximum}
                onChange={numberSetting(setDecoPO2Maximum, v => updateSettings({ decoPO2Maximum: v }))}
              />
            </Tooltip>
            <Tooltip
              title="The minimum acceptable oxygen partial pressure. This is applicable when breathing hypoxic mixtures. Default: 0.18"
              placement="right">
              <TextField
                variant="filled"
                className="settings-input"
                label="Minimum PO2"
                type="number"
                slotProps={{ htmlInput: { step: 0.01 } }}
                value={pO2Minimum}
                onChange={numberSetting(setPO2Minimum, v => updateSettings({ pO2Minimum: v }))}
              />
            </Tooltip>
            <Tooltip title="If the equivalent narcotic depth (air) exceeds this value an error will be shown. Default: 30m" placement="right">
              <TextField
                variant="filled"
                className="settings-input"
                label="Maximum END (m)"
                type="number"
                value={ENDErrorThreshold}
                onChange={numberSetting(setENDErrorThreshold, v => updateSettings({ ENDErrorThreshold: v }))}
              />
            </Tooltip>
          </div>
          <div className="dive-settings-col">
            <TextField
              variant="filled"
              className="settings-input"
              label="Descent Rate (m/min)"
              type="number"
              slotProps={{ htmlInput: { min: 1 } }}
              value={descentRate}
              onChange={numberSetting(setDescentRate, v => updateSettings({ descentRate: v }))}
            />
            <TextField
              variant="filled"
              className="settings-input"
              label="Ascent Rate (m/min)"
              type="number"
              slotProps={{ htmlInput: { min: 1 } }}
              value={ascentRate}
              onChange={numberSetting(setAscentRate, v => updateSettings({ ascentRate: v }))}
            />
            <Tooltip
              title="If this is turned off only the Nitrogen content will be considered when calculating the equivalent narcotic depth (END). If enabled both Oxygen and Nitrogen will be included. Default: On"
              placement="right">
              <FormControlLabel
                className="narcotic-toggle"
                control={
                  <Switch
                    checked={isOxygenNarcotic}
                    onChange={e => {
                      setIsOxygenNarcotic(e.target.checked);
                      updateSettings({ isOxygenNarcotic: e.target.checked });
                    }}
                  />
                }
                label={<span className="toggle-label">Is Oxygen Narcotic?</span>}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
