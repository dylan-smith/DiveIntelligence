'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { useDivePlanner } from '@/context/DivePlannerContext';
import { humanDuration } from '@/utils/format';
import { ceilingWithThreshold } from '@/utils/utility';

interface NewDepthStatsProps {
  newDepth: number;
}

export default function NewDepthStats({ newDepth }: NewDepthStatsProps) {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const currentGas = divePlanner.getCurrentGas();
  const travelTime = divePlanner.getTravelTime(newDepth);
  const currentDepth = divePlanner.getCurrentDepth();
  const isDescending = newDepth > currentDepth;
  
  const rate = isDescending
    ? divePlanner.settings.descentRate
    : divePlanner.settings.ascentRate;
  
  const newPO2 = currentGas.getPO2(newDepth);
  const newEND = ceilingWithThreshold(currentGas.getEND(newDepth));
  
  const ndl = divePlanner.getNoDecoLimit(newDepth, currentGas, 0);
  const newNDL = ndl === undefined ? '> 5 hours' : humanDuration(ndl);
  
  const newCeiling = divePlanner.getNewCeiling(newDepth, 0);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        New Depth Statistics
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography>
          {isDescending ? 'Descent' : 'Ascent'} Time:{' '}
          <strong>
            {humanDuration(travelTime)} @ {rate}m/min
          </strong>
        </Typography>
        <Tooltip
          title="Oxygen partial pressure at the new depth"
          placement="right"
        >
          <Typography>
            PO<sub>2</sub>: <strong>{newPO2.toFixed(2)}</strong>
          </Typography>
        </Tooltip>
        <Tooltip
          title="Equivalent narcotic depth at the new depth"
          placement="right"
        >
          <Typography>
            END: <strong>{newEND}m</strong>
          </Typography>
        </Tooltip>
        <Tooltip
          title="No decompression limit at the new depth"
          placement="right"
        >
          <Typography>
            NDL: <strong>{newNDL}</strong>
          </Typography>
        </Tooltip>
        <Tooltip
          title="Ceiling after traveling to the new depth"
          placement="right"
        >
          <Typography>
            Ceiling: <strong>{newCeiling}m</strong>
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
}
