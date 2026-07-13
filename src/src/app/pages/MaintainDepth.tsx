import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useDivePlannerStore } from '../dive-planner-service/dive-planner.store';
import { CurrentStats } from '../components/CurrentStats';
import { NewTimeStats } from '../components/NewTimeStats';
import { CeilingChart } from '../charts/CeilingChart';
import './MaintainDepth.css';

export function MaintainDepth() {
  const addMaintainDepthSegment = useDivePlannerStore(s => s.addMaintainDepthSegment);
  const navigate = useNavigate();

  const [timeAtDepthInput, setTimeAtDepthInput] = useState('0');
  const timeAtDepth = Number(timeAtDepthInput) || 0;

  const onSave = () => {
    addMaintainDepthSegment(timeAtDepth * 60);
    navigate('/dive-overview');
  };

  return (
    <main className="maintain-depth-main">
      <div className="main-content">
        <CurrentStats />
        <h1>Select time at depth</h1>
        <div className="time-at-depth-row">
          <div className="time-input-col">
            <div className="input-section">
              <TextField
                variant="filled"
                className="time-input"
                label="Time at Depth (mins)"
                type="number"
                value={timeAtDepthInput}
                onChange={e => setTimeAtDepthInput(e.target.value)}
              />
            </div>
            <NewTimeStats timeAtDepth={timeAtDepth} />
          </div>
          <CeilingChart timeAtDepth={timeAtDepth} />
        </div>
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
