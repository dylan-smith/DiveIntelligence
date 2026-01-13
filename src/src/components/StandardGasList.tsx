'use client';

import { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { BreathingGas } from '@/services/dive-planner-service/BreathingGas';

interface StandardGasListProps {
  disabled?: boolean;
  onGasSelected: (gas: BreathingGas) => void;
}

export default function StandardGasList({ disabled = false, onGasSelected }: StandardGasListProps) {
  const standardGases = BreathingGas.StandardGases;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
    onGasSelected(standardGases[index]);
  };

  const getGasTooltip = (gas: BreathingGas): string => {
    return `Max Depth (PO2): ${gas.maxDepthPO2}m (${gas.maxDepthPO2Deco}m deco)\nMax Depth (END): ${gas.maxDepthEND}m\nMin Depth (Hypoxia): ${gas.minDepth}m`;
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {standardGases.map((gas, index) => (
        <Tooltip key={gas.name} title={<span style={{ whiteSpace: 'pre-line' }}>{getGasTooltip(gas)}</span>} placement="right">
          <ListItemButton
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index)}
            disabled={disabled}
          >
            <ListItemText
              primary={gas.name}
              secondary={
                <span dangerouslySetInnerHTML={{ __html: gas.compositionDescription }} />
              }
            />
          </ListItemButton>
        </Tooltip>
      ))}
    </List>
  );
}
