import { forwardRef, memo } from "preact/compat";
import type { Ref } from "preact";

// COMPAT — preact/compat backfills React-only APIs (memo, forwardRef,
// Children, createPortal...) so libraries written against React run unchanged.
// vite.config aliases "react"/"react-dom" → "preact/compat", which is how a
// React component library ends up running on Preact's runtime in production.

// forwardRef: lets a parent attach a ref to a DOM node inside this component —
// a pattern many React design systems rely on.
export const Badge = memo(
  forwardRef(function Badge(
    { label }: { label: string },
    ref: Ref<HTMLSpanElement>,
  ) {
    return (
      <span
        ref={ref}
        style={{ padding: "2px 8px", border: "1px solid #888", borderRadius: 6 }}
      >
        {label}
      </span>
    );
  }),
);
// memo() wraps it so it only re-renders when `label` actually changes —
// identical semantics to React.memo.
