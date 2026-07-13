import Icon from '@mui/material/Icon';
import { useDivePlanner } from '../dive-planner-service/dive-planner.store';
import { humanDuration } from '../utility/duration';
import './ErrorList.css';

export function ErrorList() {
  const planner = useDivePlanner();

  const ceilingError = planner.getCeilingError();
  const pO2Error = planner.getPO2Error();
  const hypoxicError = planner.getHypoxicError();
  const ENDError = planner.getENDError();

  return (
    <div className="dive-error-list">
      <div className="errors">
        {ceilingError.duration > 0 && (
          <div className="plan-error">
            <Icon>error</Icon>{' '}
            <strong className="error-message">
              Exceeded ceiling by up to {ceilingError.amount.toFixed(1)}m for {humanDuration(ceilingError.duration)}
            </strong>
          </div>
        )}
        {pO2Error.duration > 0 && (
          <div className="plan-error">
            <Icon>error</Icon>{' '}
            <strong className="error-message">
              Exceeded safe PO2 for {humanDuration(pO2Error.duration)}, up to PO2 = {pO2Error.maxPO2.toFixed(2)}
            </strong>
          </div>
        )}
        {hypoxicError.duration > 0 && (
          <div className="plan-error">
            <Icon>error</Icon>{' '}
            <strong className="error-message">
              Hypoxic gas as low as {hypoxicError.minPO2.toFixed(3)} for {humanDuration(hypoxicError.duration)}
            </strong>
          </div>
        )}
        {ENDError.duration > 0 && (
          <div className="plan-error">
            <Icon>error</Icon>{' '}
            <strong className="error-message">
              END as deep as {ENDError.end.toFixed(1)}m for {humanDuration(ENDError.duration)}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
