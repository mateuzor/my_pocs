import { useEffect, useRef } from "react";
import * as d3 from "d3";

const sampleData = [30, 80, 45, 60, 20, 90, 50];

export default function Dashboard() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous renders

    svg
      .attr("width", 500)
      .attr("height", 300)
      .selectAll("rect")
      .data(sampleData)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * 70)
      .attr("y", (d) => 300 - d * 3)
      .attr("width", 50)
      .attr("height", (d) => d * 3)
      .attr("fill", "steelblue");
  }, []);

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <svg ref={ref}></svg>
    </div>
  );
}
