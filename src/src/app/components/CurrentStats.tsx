import { useMemo } from 'react';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ceilingWithThreshold } from '../utility/utility';
import { humanDuration } from '../utility/duration';
import './stat-styles.css';
import './CurrentStats.css';

export function CurrentStats() {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const currentDepth = planner.getCurrentDepth();
  const currentGas = planner.getCurrentGas();
  const currentCeiling = planner.getCurrentCeiling();
  const instantCeiling = planner.getCurrentInstantCeiling();
  const currentPO2 = currentGas.getPO2(currentDepth);
  const currentPO2Warning = planner.getPO2WarningMessage(currentPO2);
  const currentPO2Error = planner.getPO2ErrorMessage(currentPO2);
  const currentEND = ceilingWithThreshold(currentGas.getEND(currentDepth));
  const currentENDError = planner.getENDErrorMessage(currentEND);

  const noDecoLimit = useMemo(() => {
    const ndl = planner.getNoDecoLimit(currentDepth, currentGas, 0);
    return ndl === undefined ? '> 5 hours' : humanDuration(ndl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version, currentDepth, currentGas]);

  return (
    <div className="dive-current-stats">
      <div className="current-stats">
        <div className="dive-stat">
          Current Depth: <strong>{currentDepth}m</strong>
        </div>
        <div className="dive-stat">
          <Tooltip
            title="The amount of time you can stay at the current depth on the current gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)"
            placement="right">
            <span>
              No Deco Limit: <strong>{noDecoLimit}</strong>
            </span>
          </Tooltip>
        </div>
        <div className="dive-stat">
          <Tooltip
            title={`The shallowest depth you can safely ascend directly to. This takes into account any on/off-gassing that may occur during the ascent. (Instantaneous Ceiling = ${instantCeiling}m)`}
            placement="right">
            <span>
              Current Ceiling: <strong>{currentCeiling}m</strong>
            </span>
          </Tooltip>
        </div>
        <div className="dive-stat">
          Current Gas: <strong dangerouslySetInnerHTML={{ __html: currentGas.description }} />
        </div>
        <div className="gas-stat dive-stat">
          <Tooltip title={planner.settings.MaxDepthPO2Tooltip} placement="right">
            <span>
              Max Depth (PO<sub>2</sub>):{' '}
              <strong>
                {currentGas.maxDepthPO2}m ({currentGas.maxDepthPO2Deco}m deco)
              </strong>
            </span>
          </Tooltip>
        </div>
        <div className="gas-stat dive-stat">
          <Tooltip title={planner.settings.MaxDepthENDTooltip} placement="right">
            <span>
              Max Depth (END): <strong>{currentGas.maxDepthEND}m</strong>
            </span>
          </Tooltip>
        </div>
        <div className="gas-stat dive-stat">
          <Tooltip title={planner.settings.MinDepthTooltip} placement="right">
            <span>
              Min Depth (Hypoxia): <strong>{currentGas.minDepth}m</strong>
            </span>
          </Tooltip>
        </div>
        <div className="dive-stat">
          <Tooltip title="Oxygen partial pressure of the current gas at the current depth" placement="right">
            <span>
              PO<sub>2</sub>: <strong>{currentPO2.toFixed(2)}</strong>
            </span>
          </Tooltip>
          {currentPO2Warning !== undefined && (
            <Tooltip title={currentPO2Warning} placement="right">
              <Icon className="warning-icon">warning</Icon>
            </Tooltip>
          )}
          {currentPO2Error !== undefined && (
            <Tooltip title={currentPO2Error} placement="right">
              <Icon className="error-icon">error</Icon>
            </Tooltip>
          )}
        </div>
        <div className="dive-stat">
          <Tooltip title="Equivalent narcotic depth of the current gas at the current depth" placement="right">
            <span>
              END: <strong>{currentEND}m</strong>
            </span>
          </Tooltip>
          {currentENDError !== undefined && (
            <Tooltip title={currentENDError} placement="right">
              <Icon className="error-icon">error</Icon>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
