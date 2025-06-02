import React, { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 500,
  delay = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${duration}ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
