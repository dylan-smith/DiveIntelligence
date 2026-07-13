import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner } from '../dive-planner-service/dive-planner.store';
import './stat-styles.css';
import './StartGasStats.css';

interface Props {
  gas: BreathingGas;
}

export function StartGasStats({ gas }: Props) {
  const planner = useDivePlanner();
  const isMinDepthError = gas.minDepth > 0;

  return (
    <div className="dive-start-gas-stats">
      <div className="gas-calculations">
        <Tooltip title={planner.settings.MaxDepthPO2Tooltip} placement="right">
          <div className="gas-calc">
            Max Depth (PO<sub>2</sub>):{' '}
            <strong>
              {gas.maxDepthPO2}m ({gas.maxDepthPO2Deco}m deco)
            </strong>
          </div>
        </Tooltip>
        <Tooltip title={planner.settings.MaxDepthENDTooltip} placement="right">
          <div className="gas-calc">
            Max Depth (END): <strong>{gas.maxDepthEND}m</strong>
          </div>
        </Tooltip>
        <div className="gas-calc">
          <Tooltip title={planner.settings.MinDepthTooltip} placement="bottom">
            <span>
              Min Depth (Hypoxia): <strong>{gas.minDepth}m</strong>
            </span>
          </Tooltip>
          {isMinDepthError && (
            <Tooltip title="This gas cannot be breathed at the surface due to the hypoxic oxygen content">
              <Icon className="error-icon">error</Icon>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
