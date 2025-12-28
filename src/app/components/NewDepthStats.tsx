'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Paper, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useDivePlanner } from '../contexts/DivePlannerContext';
import { humanDuration } from '../utility/formatters';
import { ceilingWithThreshold } from '../utility/utility';

interface NewDepthStatsProps {
  newDepth: number;
}

export default function NewDepthStats({ newDepth }: NewDepthStatsProps) {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const settings = divePlanner.settings;

  const stats = useMemo(() => {
    const currentGas = divePlanner.getCurrentGas();
    const currentDepth = divePlanner.getCurrentDepth();
    const travelTime = divePlanner.getTravelTime(newDepth);
    const isDescent = newDepth >= currentDepth;
    const PO2 = currentGas.getPO2(newDepth);
    const END = ceilingWithThreshold(currentGas.getEND(newDepth));

    const getPO2WarningMessage = () => divePlanner.getPO2WarningMessage(PO2);
    const getPO2ErrorMessage = () => divePlanner.getPO2ErrorMessage(PO2);
    const getENDErrorMessage = () => divePlanner.getENDErrorMessage(END);

    const getNoDecoLimit = () => {
      const ndl = divePlanner.getNoDecoLimit(newDepth, currentGas, 0);
      if (ndl === undefined) {
        return '> 5 hours';
      }
      return humanDuration(ndl);
    };

    return {
      travelTime,
      descentRate: settings.descentRate,
      ascentRate: settings.ascentRate,
      isDescent,
      isAscent: !isDescent,
      PO2,
      hasPO2Warning: getPO2WarningMessage() !== undefined,
      hasPO2Error: getPO2ErrorMessage() !== undefined,
      PO2WarningMessage: getPO2WarningMessage(),
      PO2ErrorMessage: getPO2ErrorMessage(),
      END,
      hasENDError: getENDErrorMessage() !== undefined,
      ENDErrorMessage: getENDErrorMessage(),
      noDecoLimit: getNoDecoLimit(),
      ceiling: divePlanner.getNewCeiling(newDepth, 0),
      instantCeiling: divePlanner.getNewInstantCeiling(newDepth, 0),
    };
  }, [newDepth, divePlanner, settings, updateTrigger]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {stats.isDescent ? (
          <Typography>
            Descent Time: <strong>{humanDuration(stats.travelTime)} @ {stats.descentRate}m/min</strong>
          </Typography>
        ) : (
          <Typography>
            Ascent Time: <strong>{humanDuration(stats.travelTime)} @ {stats.ascentRate}m/min</strong>
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Oxygen partial pressure of the current gas at the new depth" placement="top">
            <Typography>
              PO<sub>2</sub>: <strong>{stats.PO2.toFixed(2)}</strong>
            </Typography>
          </Tooltip>
          {stats.hasPO2Warning && (
            <Tooltip title={stats.PO2WarningMessage} placement="right">
              <WarningIcon color="warning" />
            </Tooltip>
          )}
          {stats.hasPO2Error && (
            <Tooltip title={stats.PO2ErrorMessage} placement="right">
              <ErrorIcon color="error" />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Equivalent narcotic depth of the current gas at the new depth" placement="top">
            <Typography>
              END: <strong>{stats.END}m</strong>
            </Typography>
          </Tooltip>
          {stats.hasENDError && (
            <Tooltip title={stats.ENDErrorMessage} placement="right">
              <ErrorIcon color="error" />
            </Tooltip>
          )}
        </Box>
        <Tooltip title="The amount of time you can stay at the new depth on the current gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)" placement="right">
          <Typography>
            No Deco Limit: <strong>{stats.noDecoLimit}</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={`The shallowest depth you can safely ascend directly to. This takes into account any on/off-gassing that may occur during the ascent. (Instantaneous Ceiling = ${stats.instantCeiling}m)`} placement="right">
          <Typography>
            Ceiling: <strong>{stats.ceiling}m</strong>
          </Typography>
        </Tooltip>
      </Box>
    </Paper>
  );
}
