
import React from "react";
import { Chart } from "chart.js/auto";

const HeavyComponent = () => {
  React.useEffect(() => {
    const ctx = document.getElementById("myChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
        }]
      }
    });
  }, []);

  return <canvas id="myChart" width="400" height="400"></canvas>;
};

export default HeavyComponent;
