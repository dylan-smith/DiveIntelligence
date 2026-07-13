import { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { indigo } from '@mui/material/colors';
import { BreathingGas } from '../dive-planner-service/BreathingGas';

interface Props {
  disabled?: boolean;
  onGasSelected: (gas: BreathingGas) => void;
}

function getGasTooltip(gas: BreathingGas): string {
  return `Max Depth (PO2): ${gas.maxDepthPO2}m (${gas.maxDepthPO2Deco}m deco)\nMax Depth (END): ${gas.maxDepthEND}m\nMin Depth (Hypoxia): ${gas.minDepth}m`;
}

export function StandardGasList({ disabled = false, onGasSelected }: Props) {
  const standardGases = BreathingGas.StandardGases;
  const [selectedGas, setSelectedGas] = useState<BreathingGas>(standardGases[0]);

  return (
    <List disablePadding sx={{ backgroundColor: '#fff' }} role="listbox">
      {standardGases.map(gas => (
        <Tooltip key={gas.name} title={<span style={{ whiteSpace: 'pre-line' }}>{getGasTooltip(gas)}</span>} placement="left">
          <ListItemButton
            role="option"
            disabled={disabled}
            selected={gas === selectedGas}
            onClick={() => {
              setSelectedGas(gas);
              onGasSelected(gas);
            }}
            sx={{ '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: indigo[100] } }}>
            <ListItemText primary={gas.name} secondary={<span dangerouslySetInnerHTML={{ __html: gas.compositionDescription }} />} />
          </ListItemButton>
        </Tooltip>
      ))}
    </List>
  );
}
