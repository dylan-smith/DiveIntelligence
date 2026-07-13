import { DivePlan } from '../components/DivePlan';
import { DiveSummary } from '../components/DiveSummary';
import { ErrorList } from '../components/ErrorList';
import { DepthChart } from '../charts/DepthChart';
import { Po2Chart } from '../charts/Po2Chart';
import { EndChart } from '../charts/EndChart';
import { TissuesCeilingChart } from '../charts/TissuesCeilingChart';
import { TissuesPn2Chart } from '../charts/TissuesPn2Chart';
import { TissuesPheChart } from '../charts/TissuesPheChart';
import './DiveOverview.css';

export function DiveOverview() {
  return (
    <main className="dive-overview-main">
      <div className="dive-plan-section">
        <DivePlan />
        <DiveSummary />
      </div>
      <div className="graphs">
        <ErrorList />
        <DepthChart />
        <Po2Chart />
        <EndChart />
        <TissuesCeilingChart />
        <TissuesPn2Chart />
        <TissuesPheChart />
      </div>
    </main>
  );
}
