import { useLocation, Link, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// CSS injected inline for the transition animations
// ---------------------------------------------------------------------------

const transitionStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.transition-fade {
  animation: fadeIn 0.4s ease forwards;
}

.transition-slide-left {
  animation: slideInLeft 0.4s ease forwards;
}

.transition-slide-right {
  animation: slideInRight 0.4s ease forwards;
}

.transition-slide-up {
  animation: slideInUp 0.4s ease forwards;
}
`;

// ---------------------------------------------------------------------------
// Hook: usePageTransition
// Returns a CSS class name that changes on route change, triggering re-animation
// ---------------------------------------------------------------------------

type TransitionType = "fade" | "slide-left" | "slide-right" | "slide-up";

function usePageTransition(transitionType: TransitionType) {
  const location = useLocation();
  const [cssClass, setCssClass] = useState(`transition-${transitionType}`);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      // Remove class briefly so the animation re-triggers
      setCssClass("");
      const timer = setTimeout(() => {
        setCssClass(`transition-${transitionType}`);
        prevPathRef.current = location.pathname;
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, transitionType]);

  return cssClass;
}

// ---------------------------------------------------------------------------
// Demo shell with navigation and animated content area
// ---------------------------------------------------------------------------

interface TransitionShellProps {
  children: React.ReactNode;
  transition: TransitionType;
  onChangeTransition: (t: TransitionType) => void;
}

function TransitionShell({ children, transition, onChangeTransition }: TransitionShellProps) {
  const cssClass = usePageTransition(transition);

  return (
    <div style={{ padding: "2rem", maxWidth: 640, margin: "0 auto" }}>
      <h1>Route Transitions Demo</h1>

      <div
        style={{
          background: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>Select transition:</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["fade", "slide-left", "slide-right", "slide-up"] as TransitionType[]).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTransition(t)}
              style={{
                padding: "0.4rem 0.9rem",
                background: transition === t ? "#0d6efd" : "#e9ecef",
                color: transition === t ? "#fff" : "#333",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: transition === t ? 600 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <nav style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <Link to="/transitions/page-a" style={navLinkStyle}>Page A</Link>
        <Link to="/transitions/page-b" style={navLinkStyle}>Page B</Link>
        <Link to="/transitions/page-c" style={navLinkStyle}>Page C</Link>
        <Link to="/transitions" style={{ ...navLinkStyle, background: "#6c757d" }}>Home</Link>
      </nav>

      <div className={cssClass} key={cssClass}>
        {children}
      </div>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  background: "#0d6efd",
  color: "#fff",
  borderRadius: 6,
  textDecoration: "none",
  fontWeight: 500,
};

// ---------------------------------------------------------------------------
// Individual demo pages
// ---------------------------------------------------------------------------

function TransitionsHome() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>
        This demo shows how <strong>CSS-based route transitions</strong> work with
        React Router. Navigate between pages using the links above and observe
        the animation effect.
      </p>
      <p>
        The <code>useLocation</code> hook detects route changes, which triggers
        a CSS class swap to re-run the animation. The transition type can be
        changed using the selector above.
      </p>
    </div>
  );
}

function PageA() {
  return (
    <div style={{ background: "#cfe2ff", padding: "1.5rem", borderRadius: 8 }}>
      <h2>Page A</h2>
      <p>This is Page A. It uses the currently selected transition animation.</p>
      <p>Notice how the content animates in when you navigate here.</p>
    </div>
  );
}

function PageB() {
  return (
    <div style={{ background: "#d1e7dd", padding: "1.5rem", borderRadius: 8 }}>
      <h2>Page B</h2>
      <p>This is Page B. The animation class is re-applied on every route change.</p>
      <p>Try switching the transition type and navigating again!</p>
    </div>
  );
}

function PageC() {
  return (
    <div style={{ background: "#fff3cd", padding: "1.5rem", borderRadius: 8 }}>
      <h2>Page C</h2>
      <p>This is Page C. The key technique is resetting the CSS class briefly.</p>
      <p>
        By setting the class to <code>""</code> for ~20ms and then restoring it,
        the browser restarts the animation from the beginning.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component — mounts its own sub-router
// ---------------------------------------------------------------------------

export default function RouteTransitionsDemo() {
  const [transition, setTransition] = useState<TransitionType>("fade");

  return (
    <>
      <style>{transitionStyles}</style>
      <TransitionShell transition={transition} onChangeTransition={setTransition}>
        <Routes>
          <Route index element={<TransitionsHome />} />
          <Route path="page-a" element={<PageA />} />
          <Route path="page-b" element={<PageB />} />
          <Route path="page-c" element={<PageC />} />
        </Routes>
      </TransitionShell>
    </>
  );
}
