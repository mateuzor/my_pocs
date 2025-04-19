window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("counter");
  let count = parseInt(button.dataset.count, 10);

  button.addEventListener("click", () => {
    count++;
    button.textContent = `Count: ${count}`;
  });

  console.log("Hydration complete!");
});
