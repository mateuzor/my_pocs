import React, { useEffect, useLayoutEffect, useState } from "react";

const LayoutEffectExample = () => {
  const [value, setValue] = useState(0);
  useLayoutEffect(() => {
    if (value === 0) {
      setValue(Math.round(10 + Math.random() * 200));
    }
  }, [value]);
  //can be used if you are updating a ref and want to make sure it's
  //up-to-date before any code runs.
  console.log("render", value);
  return (
    <>
      <button
        style={{ backgroundColor: "blue", cursor: "pointer" }}
        onClick={() => setValue(0)}
      >
        value: {value}
      </button>
    </>
  );
};

export default LayoutEffectExample;
