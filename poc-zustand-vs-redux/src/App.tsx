import { Route, Routes, Link, Navigate } from "react-router-dom";
import CounterZustand from "./zustand/CounterZustand";
import CounterRedux from "./redux/CounterRedux";

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
        <Route path="/zustand" element={<CounterZustand />} />
        <Route path="/redux" element={<CounterRedux />} />
        <Route path="*" element={<Navigate to="/zustand" replace />} />
      </Routes>
    </div>
  );
}
