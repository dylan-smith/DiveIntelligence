'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useDivePlanner } from '@/context/DivePlannerContext';
import { humanDuration } from '@/utils/format';
import { ceilingWithThreshold } from '@/utils/utility';

export default function CurrentStats() {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const currentDepth = divePlanner.getCurrentDepth();
  const currentGas = divePlanner.getCurrentGas();
  const currentCeiling = divePlanner.getCurrentCeiling();
  const instantCeiling = divePlanner.getCurrentInstantCeiling();
  const currentPO2 = currentGas.getPO2(currentDepth);
  const currentEND = ceilingWithThreshold(currentGas.getEND(currentDepth));
  
  const pO2Warning = divePlanner.getPO2WarningMessage(currentPO2);
  const pO2Error = divePlanner.getPO2ErrorMessage(currentPO2);
  const endError = divePlanner.getENDErrorMessage(currentEND);

  const ndl = divePlanner.getNoDecoLimit(currentDepth, currentGas, 0);
  const noDecoLimit = ndl === undefined ? '> 5 hours' : humanDuration(ndl);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Current Statistics
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography>
          Current Depth: <strong>{currentDepth}m</strong>
        </Typography>
        <Tooltip
          title="The amount of time you can stay at the current depth on the current gas and safely ascend directly to the surface (Note: this takes into account off-gassing that occurs during ascent)"
          placement="right"
        >
          <Typography>
            No Deco Limit: <strong>{noDecoLimit}</strong>
          </Typography>
        </Tooltip>
        <Tooltip
          title={`The shallowest depth you can safely ascend directly to. This takes into account any on/off-gassing that may occur during the ascent. (Instantaneous Ceiling = ${instantCeiling}m)`}
          placement="right"
        >
          <Typography>
            Current Ceiling: <strong>{currentCeiling}m</strong>
          </Typography>
        </Tooltip>
        <Typography>
          Current Gas:{' '}
          <strong dangerouslySetInnerHTML={{ __html: currentGas.description }} />
        </Typography>
        <Tooltip title={divePlanner.settings.MaxDepthPO2Tooltip} placement="right">
          <Typography>
            Max Depth (PO<sub>2</sub>):{' '}
            <strong>
              {currentGas.maxDepthPO2}m ({currentGas.maxDepthPO2Deco}m deco)
            </strong>
          </Typography>
        </Tooltip>
        <Tooltip title={divePlanner.settings.MaxDepthENDTooltip} placement="right">
          <Typography>
            Max Depth (END): <strong>{currentGas.maxDepthEND}m</strong>
          </Typography>
        </Tooltip>
        <Tooltip title={divePlanner.settings.MinDepthTooltip} placement="right">
          <Typography>
            Min Depth (Hypoxia): <strong>{currentGas.minDepth}m</strong>
          </Typography>
        </Tooltip>
        <Tooltip
          title="Oxygen partial pressure of the current gas at the current depth"
          placement="right"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>
              PO<sub>2</sub>: <strong>{currentPO2.toFixed(2)}</strong>
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
        </Tooltip>
        <Tooltip
          title="Equivalent narcotic depth of the current gas at the current depth"
          placement="right"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>
              END: <strong>{currentEND}m</strong>
            </Typography>
            {endError && (
              <Tooltip title={endError} placement="right">
                <ErrorIcon color="error" fontSize="small" />
              </Tooltip>
            )}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
