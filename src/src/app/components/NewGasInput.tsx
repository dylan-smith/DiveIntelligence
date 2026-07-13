import { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { useDivePlanner } from '../dive-planner-service/dive-planner.store';
import { CustomGasInput } from './CustomGasInput';
import './NewGasInput.css';

interface Props {
  onNewGasSelected: (gas: BreathingGas) => void;
}

type GasOption = 'current' | 'optimal' | 'standard' | 'custom';

export function NewGasInput({ onNewGasSelected }: Props) {
  const planner = useDivePlanner();

  const currentGas = planner.getCurrentGas();
  const optimalGas = planner.getOptimalDecoGas(planner.getCurrentDepth());
  const standardGases = BreathingGas.StandardGases;

  const [selectedOption, setSelectedOption] = useState<GasOption>('current');
  const [standardGas, setStandardGas] = useState<BreathingGas | undefined>(undefined);
  const [customGas, setCustomGas] = useState<BreathingGas>(() => BreathingGas.create(21, 0, 79, planner.settings));

  const calculateNewGas = (option: GasOption, standard: BreathingGas | undefined, custom: BreathingGas): BreathingGas => {
    // default it to current gas (e.g. standard is selected but no option picked in dropdown)
    if (option === 'standard' && standard !== undefined) return standard;
    if (option === 'custom') return custom;
    if (option === 'optimal') return optimalGas;
    return currentGas;
  };

  return (
    <div className="dive-new-gas-input">
      <RadioGroup
        value={selectedOption}
        onChange={e => {
          const option = e.target.value as GasOption;
          setSelectedOption(option);
          onNewGasSelected(calculateNewGas(option, standardGas, customGas));
        }}>
        <div className="new-gas-input">
          <div className="new-gas-col">
            <FormControlLabel
              value="current"
              control={<Radio />}
              label={
                <div>
                  <div>Current Gas</div>
                  <div className="gas-description" dangerouslySetInnerHTML={{ __html: currentGas.description }} />
                </div>
              }
            />
            <Tooltip
              title={`The gas with the maximum O2 while staying under ${planner.settings.decoPO2Maximum} PO2, and the minimum Helium while staying at an END (Equivalent Narcotic Depth) of <= ${planner.settings.ENDErrorThreshold}m`}>
              <FormControlLabel
                value="optimal"
                className="gas-option-optimal"
                control={<Radio />}
                label={
                  <div>
                    <div>Optimal Deco Gas</div>
                    <div className="gas-description" dangerouslySetInnerHTML={{ __html: optimalGas.description }} />
                  </div>
                }
              />
            </Tooltip>
          </div>
          <div className="new-gas-col">
            <div>
              <FormControlLabel value="standard" control={<Radio />} label="Standard Gas" />
            </div>
            <div>
              <TextField
                select
                variant="filled"
                className="standard-gas-dropdown"
                disabled={selectedOption !== 'standard'}
                value={standardGas?.name ?? ''}
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: () =>
                      standardGas === undefined ? null : (
                        <div>
                          <div>{standardGas.name}</div>
                          <div className="gas-description" dangerouslySetInnerHTML={{ __html: standardGas.compositionDescription }} />
                        </div>
                      ),
                  },
                }}
                onChange={e => {
                  const gas = standardGases.find(g => g.name === e.target.value);
                  setStandardGas(gas);
                  onNewGasSelected(calculateNewGas(selectedOption, gas, customGas));
                }}>
                {standardGases.map(gas => (
                  <MenuItem key={gas.name} value={gas.name}>
                    <div>
                      <div>{gas.name}</div>
                      <div className="gas-description" dangerouslySetInnerHTML={{ __html: gas.compositionDescription }} />
                    </div>
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div className="new-gas-col">
            <FormControlLabel value="custom" control={<Radio />} label="Custom gas" />
            <CustomGasInput
              disabled={selectedOption !== 'custom'}
              onGasChanged={gas => {
                setCustomGas(gas);
                onNewGasSelected(calculateNewGas(selectedOption, standardGas, gas));
              }}
            />
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
