'use client';

import React from 'react';
import { Box, Typography, Paper, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner } from '../contexts/DivePlannerContext';
import { humanDuration } from '../utility/formatters';
import { ceilingWithThreshold } from '../utility/utility';

interface NewGasStatsProps {
  newGas: BreathingGas;
}

export default function NewGasStats({ newGas }: NewGasStatsProps) {
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

  const currentDepth = divePlanner.getCurrentDepth();
  const newGasPO2 = newGas.getPO2(currentDepth);
  const newGasEND = ceilingWithThreshold(newGas.getEND(currentDepth));

  const getPO2WarningMessage = () => divePlanner.getPO2WarningMessage(newGasPO2);
  const getPO2ErrorMessage = () => divePlanner.getPO2ErrorMessage(newGasPO2);
  const getENDErrorMessage = () => divePlanner.getENDErrorMessage(newGasEND);

  const getNoDecoLimit = () => {
    const ndl = divePlanner.getNoDecoLimit(currentDepth, newGas, 0);
    if (ndl === undefined) {
      return '> 5 hours';
    }
    return humanDuration(ndl);
  };

  const hasNewGasPO2Warning = getPO2WarningMessage() !== undefined;
  const hasNewGasPO2Error = getPO2ErrorMessage() !== undefined;
  const hasNewGasENDError = getENDErrorMessage() !== undefined;

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Oxygen partial pressure of the new gas at the current depth" placement="top">
              <Typography>
                PO<sub>2</sub>: <strong>{newGasPO2.toFixed(2)}</strong>
              </Typography>
            </Tooltip>
            {hasNewGasPO2Warning && (
              <Tooltip title={getPO2WarningMessage()} placement="right">
                <WarningIcon color="warning" />
              </Tooltip>
            )}
            {hasNewGasPO2Error && (
              <Tooltip title={getPO2ErrorMessage()} placement="right">
                <ErrorIcon color="error" />
              </Tooltip>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Equivalent narcotic depth of the new gas at the current depth" placement="top">
              <Typography>
                END: <strong>{newGasEND}m</strong>
              </Typography>
            </Tooltip>
            {hasNewGasENDError && (
              <Tooltip title={getENDErrorMessage()} placement="right">
                <ErrorIcon color="error" />
              </Tooltip>
            )}
          </Box>
          <Tooltip title="The amount of time you can stay at the current depth on the new gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)" placement="right">
            <Typography>
              No Deco Limit: <strong>{getNoDecoLimit()}</strong>
            </Typography>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Tooltip title={settings.MaxDepthPO2Tooltip} placement="right">
            <Typography>
              Max Depth (PO<sub>2</sub>): <strong>{newGas.maxDepthPO2}m ({newGas.maxDepthPO2Deco}m deco)</strong>
            </Typography>
          </Tooltip>
          <Tooltip title={settings.MaxDepthENDTooltip} placement="right">
            <Typography>
              Max Depth (END): <strong>{newGas.maxDepthEND}m</strong>
            </Typography>
          </Tooltip>
          <Tooltip title={settings.MinDepthTooltip} placement="right">
            <Typography>
              Min Depth (Hypoxia): <strong>{newGas.minDepth}m</strong>
            </Typography>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
}
