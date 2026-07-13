import { useMemo } from 'react';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ceilingWithThreshold } from '../utility/utility';
import { humanDuration } from '../utility/duration';
import './stat-styles.css';
import './NewGasStats.css';

interface Props {
  newGas: BreathingGas;
}

export function NewGasStats({ newGas }: Props) {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const currentDepth = planner.getCurrentDepth();
  const newGasPO2 = newGas.getPO2(currentDepth);
  const newGasPO2Warning = planner.getPO2WarningMessage(newGasPO2);
  const newGasPO2Error = planner.getPO2ErrorMessage(newGasPO2);
  const newGasEND = ceilingWithThreshold(newGas.getEND(currentDepth));
  const newGasENDError = planner.getENDErrorMessage(newGasEND);

  const noDecoLimit = useMemo(() => {
    const ndl = planner.getNoDecoLimit(currentDepth, newGas, 0);
    return ndl === undefined ? '> 5 hours' : humanDuration(ndl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version, currentDepth, newGas]);

  return (
    <div className="dive-new-gas-stats">
      <div className="new-gas-stats">
        <div className="gas-calculation-chunk">
          <div className="dive-stat">
            <Tooltip title="Oxygen partial pressure of the new gas at the current depth" placement="top">
              <span>
                PO<sub>2</sub>: <strong>{newGasPO2.toFixed(2)}</strong>
              </span>
            </Tooltip>
            {newGasPO2Warning !== undefined && (
              <Tooltip title={newGasPO2Warning} placement="right">
                <Icon className="warning-icon">warning</Icon>
              </Tooltip>
            )}
            {newGasPO2Error !== undefined && (
              <Tooltip title={newGasPO2Error} placement="right">
                <Icon className="error-icon">error</Icon>
              </Tooltip>
            )}
          </div>
          <div className="dive-stat">
            <Tooltip title="Equivalent narcotic depth of the new gas at the current depth" placement="top">
              <span>
                END: <strong>{newGasEND}m</strong>
              </span>
            </Tooltip>
            {newGasENDError !== undefined && (
              <Tooltip title={newGasENDError} placement="right">
                <Icon className="error-icon">error</Icon>
              </Tooltip>
            )}
          </div>
          <div className="dive-stat">
            <Tooltip
              title="The amount of time you can stay at the current depth on the new gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)"
              placement="right">
              <span>
                No Deco Limit: <strong>{noDecoLimit}</strong>
              </span>
            </Tooltip>
          </div>
        </div>
        <div className="gas-calculation-chunk">
          <div className="dive-stat">
            <Tooltip title={planner.settings.MaxDepthPO2Tooltip} placement="right">
              <span>
                Max Depth (PO<sub>2</sub>):{' '}
                <strong>
                  {newGas.maxDepthPO2}m ({newGas.maxDepthPO2Deco}m deco)
                </strong>
              </span>
            </Tooltip>
          </div>
          <div className="dive-stat">
            <Tooltip title={planner.settings.MaxDepthENDTooltip} placement="right">
              <span>
                Max Depth (END): <strong>{newGas.maxDepthEND}m</strong>
              </span>
            </Tooltip>
          </div>
          <div className="dive-stat">
            <Tooltip title={planner.settings.MinDepthTooltip} placement="right">
              <span>
                Min Depth (Hypoxia): <strong>{newGas.minDepth}m</strong>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
