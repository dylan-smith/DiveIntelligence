import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner, useDivePlannerStore } from '../dive-planner-service/dive-planner.store';
import { StandardGasList } from '../components/StandardGasList';
import { CustomGasInput } from '../components/CustomGasInput';
import { DiveSettings } from '../components/DiveSettings';
import { StartGasStats } from '../components/StartGasStats';
import './NewDive.css';

export function NewDive() {
  const planner = useDivePlanner();
  const startDive = useDivePlannerStore(s => s.startDive);
  const navigate = useNavigate();

  const [gasType, setGasType] = useState<'standard' | 'custom'>('standard');
  const [selectedStandardGas, setSelectedStandardGas] = useState<BreathingGas>(BreathingGas.StandardGases[0]);
  const [customGas, setCustomGas] = useState<BreathingGas>(() => BreathingGas.create(21, 0, 79, planner.settings));

  const selectedGas = gasType === 'standard' ? selectedStandardGas : customGas;

  const onSave = () => {
    startDive(selectedGas);
    navigate('/dive-overview');
  };

  return (
    <main>
      <header>
        <h1 id="select-starting-gas-heading" className="new-dive-heading">
          Select the starting gas for the dive
        </h1>
      </header>
      <RadioGroup
        aria-labelledby="select-starting-gas-heading"
        className="new-dive-radio-group"
        value={gasType}
        onChange={e => setGasType(e.target.value as 'standard' | 'custom')}>
        <div className="standard-gas">
          <div className="radio-button">
            <FormControlLabel value="standard" control={<Radio />} label="Standard gas" />
          </div>
          <Paper square elevation={2}>
            <StandardGasList onGasSelected={setSelectedStandardGas} disabled={gasType === 'custom'} />
          </Paper>
        </div>
        <div className="custom-gas-col">
          <div className="custom-gas">
            <div className="radio-button">
              <FormControlLabel value="custom" control={<Radio />} label="Custom gas" />
            </div>
            <CustomGasInput onGasChanged={setCustomGas} disabled={gasType === 'standard'} />
          </div>
          <Paper square elevation={2}>
            <DiveSettings />
          </Paper>
        </div>
        <div className="summary-data">
          <Paper square elevation={2} sx={{ width: 'fit-content', marginBottom: '1rem' }}>
            <StartGasStats gas={selectedGas} />
          </Paper>
          <div className="save-section">
            <Button variant="contained" color="primary" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      </RadioGroup>
    </main>
  );
}
