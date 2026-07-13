import { useMemo } from 'react';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ceilingWithThreshold } from '../utility/utility';
import { humanDuration } from '../utility/duration';
import './stat-styles.css';
import './NewDepthStats.css';

interface Props {
  newDepth: number;
}

export function NewDepthStats({ newDepth }: Props) {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const travelTime = planner.getTravelTime(newDepth);
  const descentRate = planner.settings.descentRate;
  const ascentRate = planner.settings.ascentRate;
  const isDescent = newDepth >= planner.getCurrentDepth();
  const PO2 = planner.getCurrentGas().getPO2(newDepth);
  const PO2WarningMessage = planner.getPO2WarningMessage(PO2);
  const PO2ErrorMessage = planner.getPO2ErrorMessage(PO2);
  const END = ceilingWithThreshold(planner.getCurrentGas().getEND(newDepth));
  const ENDErrorMessage = planner.getENDErrorMessage(END);

  const { noDecoLimit, ceiling, instantCeiling } = useMemo(() => {
    const ndl = planner.getNoDecoLimit(newDepth, planner.getCurrentGas(), 0);
    return {
      noDecoLimit: ndl === undefined ? '> 5 hours' : humanDuration(ndl),
      ceiling: planner.getNewCeiling(newDepth, 0),
      instantCeiling: planner.getNewInstantCeiling(newDepth, 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version, newDepth]);

  return (
    <div className="dive-new-depth-stats">
      <div className="new-depth-stats">
        {isDescent ? (
          <div className="dive-stat">
            Descent Time:{' '}
            <strong>
              {humanDuration(travelTime)} @ {descentRate}m/min
            </strong>
          </div>
        ) : (
          <div className="dive-stat">
            Ascent Time:{' '}
            <strong>
              {humanDuration(travelTime)} @ {ascentRate}m/min
            </strong>
          </div>
        )}
        <div className="dive-stat">
          <Tooltip title="Oxygen partial pressure of the current gas at the new depth" placement="top">
            <span>
              PO<sub>2</sub>: <strong>{PO2.toFixed(2)}</strong>
            </span>
          </Tooltip>
          {PO2WarningMessage !== undefined && (
            <Tooltip title={PO2WarningMessage} placement="right">
              <Icon className="warning-icon">warning</Icon>
            </Tooltip>
          )}
          {PO2ErrorMessage !== undefined && (
            <Tooltip title={PO2ErrorMessage} placement="right">
              <Icon className="error-icon">error</Icon>
            </Tooltip>
          )}
        </div>
        <div className="dive-stat">
          <Tooltip title="Equivalent narcotic depth of the current gas at the new depth" placement="top">
            <span>
              END: <strong>{END}m</strong>
            </span>
          </Tooltip>
          {ENDErrorMessage !== undefined && (
            <Tooltip title={ENDErrorMessage} placement="right">
              <Icon className="error-icon">error</Icon>
            </Tooltip>
          )}
        </div>
        <div className="dive-stat">
          <Tooltip
            title="The amount of time you can stay at the new depth on the current gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)"
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
              Ceiling: <strong>{ceiling}m</strong>
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
