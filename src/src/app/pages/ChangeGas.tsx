import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner, useDivePlannerStore } from '../dive-planner-service/dive-planner.store';
import { CurrentStats } from '../components/CurrentStats';
import { NewGasInput } from '../components/NewGasInput';
import { NewGasStats } from '../components/NewGasStats';
import './ChangeGas.css';

export function ChangeGas() {
  const planner = useDivePlanner();
  const addChangeGasSegment = useDivePlannerStore(s => s.addChangeGasSegment);
  const navigate = useNavigate();

  const [newGas, setNewGas] = useState<BreathingGas>(() => planner.getCurrentGas());

  const onSave = () => {
    addChangeGasSegment(newGas);
    navigate('/dive-overview');
  };

  return (
    <main className="change-gas-main">
      <div className="main-content">
        <CurrentStats />
        <h1>Select new gas</h1>
        <NewGasInput onNewGasSelected={setNewGas} />
        <NewGasStats newGas={newGas} />
        <div className="actions">
          <Button variant="contained" color="primary" onClick={onSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate('/dive-overview')}>
            Cancel
          </Button>
        </div>
      </div>
    </main>
  );
}
