import { useState, ReactNode } from 'react';

function Toggle({ children }: { children: (isOn: boolean, toggle: () => void) => ReactNode }) {
  const [isOn, setIsOn] = useState(false);
  return <>{children(isOn, () => setIsOn(!isOn))}</>;
}

export default Toggle;
