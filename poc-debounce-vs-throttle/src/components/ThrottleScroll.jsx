import React, { useEffect, useState } from "react";
import throttle from "../utils/throttle";

export default function ThrottleScroll() {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // Throttled scroll handler
    const handleScroll = throttle(() => {
      setPosition(window.scrollY);
    }, 200); // Throttle to max once every 200ms

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Throttle Scroll</h2>
      <p>Scroll position: {position}px</p>
      <div style={{ height: "2000px", background: "linear-gradient(#fff, #eee)" }}></div>
    </div>
  );
}
