console.log("✅ Island1 chunk loaded and executed!");

const domNode = document.getElementById("island-1");
if (domNode) {
  let count = 0;

  const button = document.createElement("button");
  button.textContent = `Island1 - Interactive! (${count})`;
  button.style.cssText = `
    padding: 1rem 2rem;
    fontSize: 16px;
    backgroundColor: #4CAF50;
    color: white;
    border: 1px solid #45a049;
    borderRadius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  `;

  button.addEventListener("click", () => {
    count++;
    button.textContent = `Island1 - Interactive! (${count})`;
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 100);
  });

  button.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "#45a049";
  });

  button.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "#4CAF50";
  });

  domNode.innerHTML = "";
  domNode.appendChild(button);
}
