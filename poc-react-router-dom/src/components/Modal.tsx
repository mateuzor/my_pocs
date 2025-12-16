import type { ReactNode } from "react";

export default function Modal(props: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onMouseDown={props.onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{ background: "white", color: "black", padding: 16, width: 480 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>{props.title}</h3>
          <button onClick={props.onClose}>X</button>
        </div>

        <div style={{ marginTop: 12 }}>{props.children}</div>
      </div>
    </div>
  );
}
