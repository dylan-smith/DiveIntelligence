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
  const { divePlanner } = useDivePlanner();
  const settings = divePlanner.settings;

  // Guard against accessing dive data before dive is started
  if (!divePlanner || divePlanner.getDiveSegments().length < 2) {
    return (
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography>No active dive.</Typography>
      </Paper>
    );
  }

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

  const hasPO2Warning = getPO2WarningMessage() !== undefined;
  const hasPO2Error = getPO2ErrorMessage() !== undefined;
  const hasENDError = getENDErrorMessage() !== undefined;
  const ceiling = divePlanner.getNewCeiling(newDepth, 0);
  const instantCeiling = divePlanner.getNewInstantCeiling(newDepth, 0);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isDescent ? (
          <Typography>
            Descent Time: <strong>{humanDuration(travelTime)} @ {settings.descentRate}m/min</strong>
          </Typography>
        ) : (
          <Typography>
            Ascent Time: <strong>{humanDuration(travelTime)} @ {settings.ascentRate}m/min</strong>
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Oxygen partial pressure of the current gas at the new depth" placement="top">
            <Typography>
              PO<sub>2</sub>: <strong>{PO2.toFixed(2)}</strong>
            </Typography>
          </Tooltip>
          {hasPO2Warning && (
            <Tooltip title={getPO2WarningMessage()} placement="right">
              <WarningIcon color="warning" />
            </Tooltip>
          )}
          {hasPO2Error && (
            <Tooltip title={getPO2ErrorMessage()} placement="right">
              <ErrorIcon color="error" />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Equivalent narcotic depth of the current gas at the new depth" placement="top">
            <Typography>
              END: <strong>{END}m</strong>
            </Typography>
          </Tooltip>
          {hasENDError && (
            <Tooltip title={getENDErrorMessage()} placement="right">
              <ErrorIcon color="error" />
            </Tooltip>
          )}
        </Box>
        <Tooltip title="The amount of time you can stay at the new depth on the current gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)" placement="right">
          <Typography>
            No Deco Limit: <strong>{getNoDecoLimit()}</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={`The shallowest depth you can safely ascend directly to. This takes into account any on/off-gassing that may occur during the ascent. (Instantaneous Ceiling = ${instantCeiling}m)`} placement="right">
          <Typography>
            Ceiling: <strong>{ceiling}m</strong>
          </Typography>
        </Tooltip>
      </Box>
    </Paper>
  );
}
