'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useDivePlanner } from '../contexts/DivePlannerContext';
import { humanDuration } from '../utility/formatters';

export default function ErrorList() {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const getCeilingError = () => divePlanner.getCeilingError();
  const getPO2Error = () => divePlanner.getPO2Error();
  const getHypoxicError = () => divePlanner.getHypoxicError();
  const getENDError = () => divePlanner.getENDError();

  const showCeilingError = () => getCeilingError().duration > 0;
  const showPO2Error = () => getPO2Error().duration > 0;
  const showHypoxicError = () => getHypoxicError().duration > 0;
  const showENDError = () => getENDError().duration > 0;

  const hasErrors = showCeilingError() || showPO2Error() || showHypoxicError() || showENDError();

  if (!hasErrors) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {showCeilingError() && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <ErrorIcon />
            <Typography>
              <strong>
                Exceeded ceiling by up to {getCeilingError().amount.toFixed(1)}m for {humanDuration(getCeilingError().duration)}
              </strong>
            </Typography>
          </Box>
        )}
        {showPO2Error() && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <ErrorIcon />
            <Typography>
              <strong>
                Exceeded safe PO2 for {humanDuration(getPO2Error().duration)}, up to PO2 = {getPO2Error().maxPO2.toFixed(2)}
              </strong>
            </Typography>
          </Box>
        )}
        {showHypoxicError() && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <ErrorIcon />
            <Typography>
              <strong>
                Hypoxic gas as low as {getHypoxicError().minPO2.toFixed(3)} for {humanDuration(getHypoxicError().duration)}
              </strong>
            </Typography>
          </Box>
        )}
        {showENDError() && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <ErrorIcon />
            <Typography>
              <strong>
                END as deep as {getENDError().end.toFixed(1)}m for {humanDuration(getENDError().duration)}
              </strong>
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
