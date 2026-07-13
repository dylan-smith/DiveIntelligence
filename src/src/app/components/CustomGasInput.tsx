import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner } from '../dive-planner-service/dive-planner.store';
import './CustomGasInput.css';

interface Props {
  disabled?: boolean;
  onGasChanged: (gas: BreathingGas) => void;
}

export function CustomGasInput({ disabled = false, onGasChanged }: Props) {
  const planner = useDivePlanner();
  const [oxygen, setOxygen] = useState(21);
  const [helium, setHelium] = useState(0);

  const nitrogen = 100 - oxygen - helium;

  const emitGas = (newOxygen: number, newHelium: number) => {
    onGasChanged(BreathingGas.create(newOxygen, newHelium, 100 - newOxygen - newHelium, planner.settings));
  };

  return (
    <div className="custom-gas-input">
      <TextField
        variant="filled"
        label="Oxygen (%)"
        type="number"
        slotProps={{ htmlInput: { min: 0, max: 100 } }}
        value={oxygen}
        disabled={disabled}
        onChange={e => {
          const value = Number(e.target.value);
          setOxygen(value);
          emitGas(value, helium);
        }}
      />
      <TextField
        variant="filled"
        label="Helium (%)"
        type="number"
        slotProps={{ htmlInput: { min: 0, max: 100 } }}
        value={helium}
        disabled={disabled}
        onChange={e => {
          const value = Number(e.target.value);
          setHelium(value);
          emitGas(oxygen, value);
        }}
      />
      <Tooltip title="The nitrogen value will be automatically calculated when you input the values for oxygen and helium">
        <TextField variant="filled" label="Nitrogen (%)" type="number" value={nitrogen} disabled />
      </Tooltip>
    </div>
  );
}
