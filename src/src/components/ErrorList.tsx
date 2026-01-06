'use client';

import { Box, Typography, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useDivePlanner } from '@/context/DivePlannerContext';
import { humanDuration } from '@/utils/format';

export default function ErrorList() {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const ceilingError = divePlanner.getCeilingError();
  const pO2Error = divePlanner.getPO2Error();
  const hypoxicError = divePlanner.getHypoxicError();
  const endError = divePlanner.getENDError();

  const showCeilingError = ceilingError.duration > 0;
  const showPO2Error = pO2Error.duration > 0;
  const showHypoxicError = hypoxicError.duration > 0;
  const showENDError = endError.duration > 0;

  if (!showCeilingError && !showPO2Error && !showHypoxicError && !showENDError) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, bgcolor: 'error.light' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {showCeilingError && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon color="error" />
            <Typography>
              <strong>
                Exceeded ceiling by up to {ceilingError.amount.toFixed(1)}m for{' '}
                {humanDuration(ceilingError.duration)}
              </strong>
            </Typography>
          </Box>
        )}
        {showPO2Error && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon color="error" />
            <Typography>
              <strong>
                Exceeded safe PO2 for {humanDuration(pO2Error.duration)}, up to PO2 ={' '}
                {pO2Error.maxPO2.toFixed(2)}
              </strong>
            </Typography>
          </Box>
        )}
        {showHypoxicError && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon color="error" />
            <Typography>
              <strong>
                Hypoxic gas as low as {hypoxicError.minPO2.toFixed(3)} for{' '}
                {humanDuration(hypoxicError.duration)}
              </strong>
            </Typography>
          </Box>
        )}
        {showENDError && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon color="error" />
            <Typography>
              <strong>
                END as deep as {endError.end.toFixed(1)}m for {humanDuration(endError.duration)}
              </strong>
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
