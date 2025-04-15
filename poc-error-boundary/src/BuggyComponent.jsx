import React, { useState } from "react";

export default function BuggyComponent() {
  const [explode, setExplode] = useState(false);

  if (explode) throw new Error("💣 Boom! Component crashed!");

  return (
    <div>
      <p>This component simulates a crash.</p>
      <button onClick={() => setExplode(true)}>Trigger Error</button>
    </div>
  );
}
