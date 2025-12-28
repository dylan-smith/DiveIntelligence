'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Paper, Tooltip, Divider } from '@mui/material';
import { useDivePlanner } from '../contexts/DivePlannerContext';
import { humanDuration } from '../utility/formatters';
import { ceilingWithThreshold } from '../utility/utility';
import { BreathingGas } from '../dive-planner-service/BreathingGas';

interface NewTimeStatsProps {
  timeAtDepth: number;
}

export default function NewTimeStats({ timeAtDepth }: NewTimeStatsProps) {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const currentDepth = divePlanner.getCurrentDepth();

  const stats = useMemo(() => {
    const totalDiveDuration = divePlanner.getCurrentDiveTime() + timeAtDepth * 60;
    const ceiling = divePlanner.getNewCeiling(currentDepth, timeAtDepth * 60);
    const instantCeiling = divePlanner.getNewInstantCeiling(currentDepth, timeAtDepth * 60);

    const getNoDecoLimit = () => {
      const ndl = divePlanner.getNoDecoLimit(currentDepth, divePlanner.getCurrentGas(), timeAtDepth * 60);
      if (ndl === undefined) {
        return '> 5 hours';
      }
      return humanDuration(ndl);
    };

    const getDecoMilestones = () => {
      const ceilingData = divePlanner.getCeilingChartData(currentDepth, divePlanner.getCurrentGas());
      const ceilingValues = ceilingData.map(d => ceilingWithThreshold(d.ceiling));
      const standardGases = divePlanner.getStandardGases();
      const decoGases = standardGases.filter(g => g.maxDecoDepth < ceilingValues[0]);
      const milestones: { duration: number; gas: string; depth: number; tooltip: string }[] = [];
      let decoComplete = 0;

      for (let t = 0; t < ceilingValues.length && decoComplete === 0; t++) {
        const gasToRemove: BreathingGas[] = [];
        for (const gas of decoGases) {
          if (ceilingWithThreshold(ceilingValues[t]) <= gas.maxDecoDepth) {
            const tooltip = `If you spend ${humanDuration(t)} at ${currentDepth}m, the ceiling will rise to ${ceilingValues[t]}m which allow you to ascend and switch to ${gas.name}`;
            milestones.push({ duration: t, gas: gas.name, depth: ceilingValues[t], tooltip: tooltip });
            gasToRemove.push(gas);
          }
        }

        for (const gas of gasToRemove) {
          decoGases.splice(decoGases.indexOf(gas), 1);
        }

        if (ceilingValues[t] === 0 && decoComplete === 0) {
          decoComplete = t;
        }
      }

      if (ceilingValues[0] > 0 && decoComplete > 0) {
        const tooltip = `If you spend ${humanDuration(decoComplete)} at ${currentDepth}m your decompression will be complete and you can ascend directly to the surface`;
        milestones.push({ duration: decoComplete, gas: 'Deco complete', depth: 0, tooltip: tooltip });
      }

      return milestones;
    };

    return {
      totalDiveDuration,
      ceiling,
      instantCeiling,
      noDecoLimit: getNoDecoLimit(),
      decoMilestones: getDecoMilestones(),
    };
  }, [timeAtDepth, currentDepth, divePlanner, updateTrigger]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tooltip title="The amount of additional time you can stay at the current depth on the current gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)" placement="right">
          <Typography>
            No Deco Limit: <strong>{stats.noDecoLimit}</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={`The shallowest depth you can safely ascend directly to. This takes into account any on/off-gassing that may occur during the ascent. (Instantaneous Ceiling = ${stats.instantCeiling}m)`} placement="right">
          <Typography>
            Ceiling: <strong>{stats.ceiling}m</strong>
          </Typography>
        </Tooltip>
        <Tooltip title="Total dive runtime after the time at depth" placement="right">
          <Typography>
            Total Dive Duration: <strong>{humanDuration(stats.totalDiveDuration)}</strong>
          </Typography>
        </Tooltip>
        {stats.decoMilestones.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            {stats.decoMilestones.map((milestone, index) => (
              <Tooltip key={index} title={milestone.tooltip} placement="right">
                <Typography>
                  <strong>{humanDuration(milestone.duration)}</strong>: {milestone.gas} @ {milestone.depth}m
                </Typography>
              </Tooltip>
            ))}
          </>
        )}
      </Box>
    </Paper>
  );
}
