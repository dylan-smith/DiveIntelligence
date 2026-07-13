import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useDivePlanner, useDivePlannerStore } from '../dive-planner-service/dive-planner.store';
import { CurrentStats } from '../components/CurrentStats';
import { NewDepthStats } from '../components/NewDepthStats';
import './ChangeDepth.css';

export function ChangeDepth() {
  const planner = useDivePlanner();
  const addChangeDepthSegment = useDivePlannerStore(s => s.addChangeDepthSegment);
  const navigate = useNavigate();

  const [newDepthInput, setNewDepthInput] = useState(String(planner.getCurrentDepth()));
  const newDepth = Number(newDepthInput) || 0;

  const onSave = () => {
    addChangeDepthSegment(newDepth);
    navigate('/dive-overview');
  };

  return (
    <main className="change-depth-main">
      <div className="main-content">
        <Paper square elevation={2} sx={{ marginTop: '1rem', width: 'fit-content', height: 'fit-content' }}>
          <CurrentStats />
        </Paper>
        <h1>Select new depth</h1>
        <div className="new-depth-row">
          <div className="input-section">
            <TextField
              variant="filled"
              className="depth-input"
              label="New Depth (m)"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={newDepthInput}
              onChange={e => setNewDepthInput(e.target.value)}
            />
          </div>
        </div>
        <Paper square elevation={2} sx={{ marginTop: '1rem', width: 'fit-content', height: 'fit-content' }}>
          <NewDepthStats newDepth={newDepth} />
        </Paper>
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
