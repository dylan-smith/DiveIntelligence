import { useMemo } from 'react';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ceilingWithThreshold } from '../utility/utility';
import { humanDuration } from '../utility/duration';
import type { DivePlanner } from '../dive-planner-service/DivePlanner';
import './stat-styles.css';
import './NewTimeStats.css';

interface Props {
  timeAtDepth: number;
}

function getDecoMilestones(
  planner: DivePlanner,
  currentDepth: number,
  data: { time: number; ceiling: number }[]
): { duration: number; gas: string; depth: number; tooltip: string }[] {
  const ceilingData = data.map(d => ceilingWithThreshold(d.ceiling));
  const standardGases = planner.getStandardGases();
  const decoGases = standardGases.filter(g => g.maxDecoDepth < ceilingData[0]);
  const milestones: { duration: number; gas: string; depth: number; tooltip: string }[] = [];
  let decoComplete = 0;

  for (let t = 0; t < ceilingData.length && decoComplete === 0; t++) {
    const gasToRemove: BreathingGas[] = [];
    for (const gas of decoGases) {
      if (ceilingWithThreshold(ceilingData[t]) <= gas.maxDecoDepth) {
        const tooltip = `If you spend ${humanDuration(t)} at ${currentDepth}m, the ceiling will rise to
                         ${ceilingData[t]}m which allow you to ascend and switch to ${gas.name}`;
        milestones.push({ duration: t, gas: gas.name, depth: ceilingData[t], tooltip: tooltip });
        gasToRemove.push(gas);
      }
    }

    for (const gas of gasToRemove) {
      decoGases.splice(decoGases.indexOf(gas), 1);
    }

    if (ceilingData[t] === 0 && decoComplete === 0) {
      decoComplete = t;
    }
  }

  if (ceilingData[0] > 0 && decoComplete > 0) {
    const tooltip = `If you spend ${humanDuration(decoComplete)} at
                     ${currentDepth}m your decompression will be complete and you can ascend directly to the surface`;
    milestones.push({ duration: decoComplete, gas: 'Deco complete', depth: 0, tooltip: tooltip });
  }

  return milestones;
}

export function NewTimeStats({ timeAtDepth }: Props) {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const currentDepth = planner.getCurrentDepth();
  const totalDiveDuration = planner.getCurrentDiveTime() + timeAtDepth * 60;

  // The deco milestones are derived from the ceiling chart data, which does not
  // depend on timeAtDepth (matches the Angular version, which computed it once).
  const decoMilestones = useMemo(() => {
    const ceilingData = planner.getCeilingChartData(currentDepth, planner.getCurrentGas());
    return getDecoMilestones(planner, currentDepth, ceilingData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version, currentDepth]);

  const { noDecoLimit, ceiling, instantCeiling } = useMemo(() => {
    const ndl = planner.getNoDecoLimit(currentDepth, planner.getCurrentGas(), timeAtDepth * 60);
    return {
      noDecoLimit: ndl === undefined ? '> 5 hours' : humanDuration(ndl),
      ceiling: planner.getNewCeiling(currentDepth, timeAtDepth * 60),
      instantCeiling: planner.getNewInstantCeiling(currentDepth, timeAtDepth * 60),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version, currentDepth, timeAtDepth]);

  return (
    <div className="dive-new-time-stats">
      <div className="new-time-stats">
        <div className="dive-stat">
          <Tooltip
            title="The amount of additional time you can stay at the current depth on the current gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)"
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
        <div className="dive-stat">
          <Tooltip title="Total dive runtime after the time at depth" placement="right">
            <span>
              Total Dive Duration: <strong>{humanDuration(totalDiveDuration)}</strong>
            </span>
          </Tooltip>
        </div>
        {decoMilestones.length > 0 && <Divider className="stats-divider" />}
        {decoMilestones.map((milestone, i) => (
          <div className="dive-stat deco-milestone" key={i}>
            <Tooltip title={milestone.tooltip} placement="right">
              <span>
                <strong>{humanDuration(milestone.duration)}</strong> : {milestone.gas} @ {milestone.depth}m
              </span>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
