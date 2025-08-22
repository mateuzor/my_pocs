import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const HeavyComponent = () => {
  // Ref to hold the Chart.js instance
  const chartRef = useRef<Chart | null>(null);
  // Ref to the canvas element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy the previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new chart instance
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
        ],
      },
    });

    // Cleanup function: destroy chart when component unmounts
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  // Render the canvas
  return <canvas ref={canvasRef} width="400" height="400"></canvas>;
};

export default HeavyComponent;
