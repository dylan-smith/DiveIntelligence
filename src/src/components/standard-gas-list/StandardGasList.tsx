'use client';

import {
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Paper
} from '@mui/material';
import { BreathingGas } from '@/lib/dive-planner/BreathingGas';

interface StandardGasListProps {
  disabled: boolean;
  onGasSelected: (gas: BreathingGas) => void;
  selectedGas: BreathingGas;
}

export default function StandardGasList({ disabled, onGasSelected, selectedGas }: StandardGasListProps) {
  const standardGases = BreathingGas.StandardGases;

  const getGasTooltip = (gas: BreathingGas): string => {
    return `Max Depth (PO2): ${gas.maxDepthPO2}m (${gas.maxDepthPO2Deco}m deco)\nMax Depth (END): ${gas.maxDepthEND}m\nMin Depth (Hypoxia): ${gas.minDepth}m`;
  };

  return (
    <Paper elevation={2}>
      <List>
        {standardGases.map((gas) => (
          <Tooltip 
            key={gas.name} 
            title={<span style={{ whiteSpace: 'pre-line' }}>{getGasTooltip(gas)}</span>}
            placement="left"
          >
            <ListItemButton
              selected={gas === selectedGas}
              onClick={() => onGasSelected(gas)}
              disabled={disabled}
            >
              <ListItemText
                primary={gas.name}
                secondary={<span dangerouslySetInnerHTML={{ __html: gas.compositionDescription }} />}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Paper>
  );
}
