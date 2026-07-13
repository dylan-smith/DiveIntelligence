import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import { useDivePlanner } from '../dive-planner-service/dive-planner.store';
import { colonDuration } from '../utility/duration';
import './DivePlan.css';

export function DivePlan() {
  const planner = useDivePlanner();
  const navigate = useNavigate();

  const planEvents = planner.getDiveSegments();

  return (
    <div className="dive-plan-list-section">
      <Paper square elevation={2}>
        <List disablePadding className="dive-plan-list" role="listbox">
          {planEvents.map((planEvent, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={
                  <>
                    <Icon className="segment-icon">{planEvent.Icon}</Icon> {colonDuration(planEvent.StartTimestamp)} {planEvent.Title}
                  </>
                }
                secondary={<span className="segment-description" dangerouslySetInnerHTML={{ __html: planEvent.Description }} />}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <div className="segment-buttons">
        <Tooltip title="Ascend/Descend">
          <Fab color="primary" className="add-segment-button" onClick={() => navigate('/change-depth')}>
            <Icon>height</Icon>
          </Fab>
        </Tooltip>
        <Tooltip title="Change Gas">
          <Fab color="primary" className="add-segment-button" onClick={() => navigate('/change-gas')}>
            <Icon>air</Icon>
          </Fab>
        </Tooltip>
        <Tooltip title="Maintain Depth">
          <Fab color="primary" className="add-segment-button" onClick={() => navigate('/maintain-depth')}>
            <Icon>arrow_forward</Icon>
          </Fab>
        </Tooltip>
      </div>
    </div>
  );
}
