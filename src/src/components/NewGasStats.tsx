'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useDivePlanner } from '@/context/DivePlannerContext';
import { BreathingGas } from '@/services/dive-planner-service/BreathingGas';
import { ceilingWithThreshold } from '@/utils/utility';

interface NewGasStatsProps {
  gas: BreathingGas;
}

export default function NewGasStats({ gas }: NewGasStatsProps) {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const settings = divePlanner.settings;
  const currentDepth = divePlanner.getCurrentDepth();

  const newPO2 = gas.getPO2(currentDepth);
  const newEND = ceilingWithThreshold(gas.getEND(currentDepth));
  
  const pO2Warning = divePlanner.getPO2WarningMessage(newPO2);
  const pO2Error = divePlanner.getPO2ErrorMessage(newPO2);
  const endError = divePlanner.getENDErrorMessage(newEND);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        New Gas Statistics
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tooltip title={settings.MaxDepthPO2Tooltip} placement="right">
          <Typography>
            Max Depth (PO<sub>2</sub>):{' '}
            <strong>
              {gas.maxDepthPO2}m ({gas.maxDepthPO2Deco}m deco)
            </strong>
          </Typography>
        </Tooltip>
        <Tooltip title={settings.MaxDepthENDTooltip} placement="right">
          <Typography>
            Max Depth (END): <strong>{gas.maxDepthEND}m</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={settings.MinDepthTooltip} placement="right">
          <Typography>
            Min Depth (Hypoxia): <strong>{gas.minDepth}m</strong>
          </Typography>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>
            PO<sub>2</sub> at current depth: <strong>{newPO2.toFixed(2)}</strong>
          </Typography>
          {pO2Warning && (
            <Tooltip title={pO2Warning} placement="right">
              <WarningIcon color="warning" fontSize="small" />
            </Tooltip>
          )}
          {pO2Error && (
            <Tooltip title={pO2Error} placement="right">
              <ErrorIcon color="error" fontSize="small" />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>
            END at current depth: <strong>{newEND}m</strong>
          </Typography>
          {endError && (
            <Tooltip title={endError} placement="right">
              <ErrorIcon color="error" fontSize="small" />
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
}
