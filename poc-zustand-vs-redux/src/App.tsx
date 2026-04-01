import { Route, Routes, Link, Navigate } from "react-router-dom";
import CounterZustand from "./zustand/CounterZustand";
import CounterRedux from "./redux/CounterRedux";
import { TodoZustand } from "./zustand/TodoZustand";
import { AppStoreDemo } from "./zustand/AppStoreDemo";
import { Comparison } from "./components/Comparison";
import { JotaiBasic } from "./jotai/JotaiBasic";
import { RecoilAtoms } from "./recoil/RecoilAtoms";
import { RecoilSelectors } from "./recoil/RecoilSelectors";
import { TrafficLight } from "./xstate/TrafficLight";
import { AuthMachine } from "./xstate/AuthMachine";
import { FetchMachine } from "./xstate/FetchMachine";
import { CounterActor } from "./xstate/CounterActor";

export default function App() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-x-4">
        <Link to="/zustand" className="underline">
          Zustand
        </Link>
        <Link to="/redux" className="underline">
          Redux
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/zustand" replace />} />
        <Route path="/zustand" element={<><CounterZustand /><TodoZustand /><AppStoreDemo /><Comparison /><JotaiBasic /><RecoilAtoms /><RecoilSelectors /><TrafficLight /><AuthMachine /><FetchMachine /><CounterActor /></>} />
        <Route path="/redux" element={<CounterRedux />} />
        <Route path="*" element={<Navigate to="/zustand" replace />} />
      </Routes>
    </div>
  );
}
