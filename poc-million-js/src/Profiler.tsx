import { Profiler, type ReactNode } from 'react';

export interface Sample {
  label: string;
  phase: string;
  actualMs: number;
}

// React's <Profiler> reports the time spent rendering+committing its subtree.
// We use it (instead of performance.now around setState) because it measures
// the actual React work, which is where Million claims its gains.
export function Measured({
  label,
  onSample,
  children,
}: {
  label: string;
  onSample: (s: Sample) => void;
  children: ReactNode;
}) {
  return (
    <Profiler
      id={label}
      onRender={(_id, phase, actualDuration) =>
        onSample({ label, phase, actualMs: actualDuration })
      }
    >
      {children}
    </Profiler>
  );
}
