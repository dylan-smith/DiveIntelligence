import Paper from '@mui/material/Paper';
import { useDivePlanner } from '../dive-planner-service/dive-planner.store';
import { humanDuration } from '../utility/duration';
import './stat-styles.css';
import './DiveSummary.css';

export function DiveSummary() {
  const planner = useDivePlanner();

  return (
    <div className="dive-dive-summary">
      <Paper square elevation={2} className="dive-stats">
        <div className="dive-stat">
          Dive Duration: <strong>{humanDuration(planner.getDiveDuration())}</strong>
        </div>
        <div className="dive-stat">
          Max Depth: <strong>{planner.getMaxDepth()}m</strong>
        </div>
        <div className="dive-stat">
          Average Depth: <strong>{Math.round(planner.getAverageDepth())}m</strong>
        </div>
      </Paper>
    </div>
  );
}
