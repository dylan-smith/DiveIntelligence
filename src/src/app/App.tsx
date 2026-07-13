import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { NewDive } from './pages/NewDive';
import { DiveOverview } from './pages/DiveOverview';
import { ChangeDepth } from './pages/ChangeDepth';
import { ChangeGas } from './pages/ChangeGas';
import { MaintainDepth } from './pages/MaintainDepth';

export function App() {
  return (
    <Routes>
      <Route path="/new-dive" element={<NewDive />} />
      <Route path="/dive-overview" element={<DiveOverview />} />
      <Route path="/change-depth" element={<ChangeDepth />} />
      <Route path="/change-gas" element={<ChangeGas />} />
      <Route path="/maintain-depth" element={<MaintainDepth />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
