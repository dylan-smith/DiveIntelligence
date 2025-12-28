'use client';

import React, { useState, useEffect } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Paper,
} from '@mui/material';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner } from '../contexts/DivePlannerContext';

interface StandardGasListProps {
  disabled?: boolean;
  onGasSelected: (gas: BreathingGas) => void;
}

export default function StandardGasList({ disabled = false, onGasSelected }: StandardGasListProps) {
  const { divePlanner } = useDivePlanner();
  const [standardGases, setStandardGases] = useState<BreathingGas[]>([]);
  const [selectedGas, setSelectedGas] = useState<BreathingGas | null>(null);

  useEffect(() => {
    const gases = divePlanner.getStandardGases();
    setStandardGases(gases);
    if (gases.length > 0 && !selectedGas) {
      setSelectedGas(gases[0]);
    }
  }, [divePlanner, selectedGas]);

  const handleGasChange = (gas: BreathingGas) => {
    if (!disabled) {
      setSelectedGas(gas);
      onGasSelected(gas);
    }
  };

  const getGasTooltip = (gas: BreathingGas): string => {
    return `Max Depth (PO2): ${gas.maxDepthPO2}m (${gas.maxDepthPO2Deco}m deco)\nMax Depth (END): ${gas.maxDepthEND}m\nMin Depth (Hypoxia): ${gas.minDepth}m`;
  };

  return (
    <Paper elevation={2}>
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {standardGases.map((gas, index) => (
          <Tooltip
            key={index}
            title={<span style={{ whiteSpace: 'pre-line' }}>{getGasTooltip(gas)}</span>}
            placement="left"
          >
            <ListItemButton
              selected={gas === selectedGas}
              onClick={() => handleGasChange(gas)}
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
