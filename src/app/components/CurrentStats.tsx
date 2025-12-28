'use client';

import React from 'react';
import { Box, Typography, Paper, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useDivePlanner } from '../contexts/DivePlannerContext';
import { humanDuration } from '../utility/formatters';
import { ceilingWithThreshold } from '../utility/utility';

export default function CurrentStats() {
  const { divePlanner } = useDivePlanner();

  // Guard against accessing dive data before dive is started
  if (!divePlanner || divePlanner.getDiveSegments().length < 2) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography>No active dive. Please start a dive first.</Typography>
      </Paper>
    );
  }

  const currentDepth = divePlanner.getCurrentDepth();
  const currentGas = divePlanner.getCurrentGas();
  const currentCeiling = divePlanner.getCurrentCeiling();
  const instantCeiling = divePlanner.getCurrentInstantCeiling();
  const settings = divePlanner.settings;

  const getPO2 = () => currentGas.getPO2(currentDepth);
  const getEND = () => ceilingWithThreshold(currentGas.getEND(currentDepth));

  const getPO2WarningMessage = () => divePlanner.getPO2WarningMessage(getPO2());
  const getPO2ErrorMessage = () => divePlanner.getPO2ErrorMessage(getPO2());
  const getENDErrorMessage = () => divePlanner.getENDErrorMessage(getEND());

  const getNoDecoLimit = () => {
    const ndl = divePlanner.getNoDecoLimit(currentDepth, currentGas, 0);
    if (ndl === undefined) {
      return '> 5 hours';
    }
    return humanDuration(ndl);
  };

  const hasCurrentPO2Warning = getPO2WarningMessage() !== undefined;
  const hasCurrentPO2Error = getPO2ErrorMessage() !== undefined;
  const hasCurrentENDError = getENDErrorMessage() !== undefined;

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography>
          Current Depth: <strong>{currentDepth}m</strong>
        </Typography>
        <Tooltip title="The amount of time you can stay at the current depth on the current gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)" placement="right">
          <Typography>
            No Deco Limit: <strong>{getNoDecoLimit()}</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={`The shallowest depth you can safely ascend directly to. This takes into account any on/off-gassing that may occur during the ascent. (Instantaneous Ceiling = ${instantCeiling}m)`} placement="right">
          <Typography>
            Current Ceiling: <strong>{currentCeiling}m</strong>
          </Typography>
        </Tooltip>
        <Typography>
          Current Gas: <strong dangerouslySetInnerHTML={{ __html: currentGas.description }} />
        </Typography>
        <Tooltip title={settings.MaxDepthPO2Tooltip} placement="right">
          <Typography>
            Max Depth (PO<sub>2</sub>): <strong>{currentGas.maxDepthPO2}m ({currentGas.maxDepthPO2Deco}m deco)</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={settings.MaxDepthENDTooltip} placement="right">
          <Typography>
            Max Depth (END): <strong>{currentGas.maxDepthEND}m</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={settings.MinDepthTooltip} placement="right">
          <Typography>
            Min Depth (Hypoxia): <strong>{currentGas.minDepth}m</strong>
          </Typography>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Oxygen partial pressure of the current gas at the current depth" placement="right">
            <Typography>
              PO<sub>2</sub>: <strong>{getPO2().toFixed(2)}</strong>
            </Typography>
          </Tooltip>
          {hasCurrentPO2Warning && (
            <Tooltip title={getPO2WarningMessage()} placement="right">
              <WarningIcon color="warning" />
            </Tooltip>
          )}
          {hasCurrentPO2Error && (
            <Tooltip title={getPO2ErrorMessage()} placement="right">
              <ErrorIcon color="error" />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Equivalent narcotic depth of the current gas at the current depth" placement="right">
            <Typography>
              END: <strong>{getEND()}m</strong>
            </Typography>
          </Tooltip>
          {hasCurrentENDError && (
            <Tooltip title={getENDErrorMessage()} placement="right">
              <ErrorIcon color="error" />
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
