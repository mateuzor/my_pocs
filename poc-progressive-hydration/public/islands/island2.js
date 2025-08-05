console.log("✅ Island2 chunk loaded and executed!");

// Adicionar delay para simular carregamento
setTimeout(() => {
  const domNode = document.getElementById("island-2");
  if (domNode) {
    let count = 0;

    const button = document.createElement("button");
    button.textContent = `Island2 - Interactive! (${count})`;
    button.style.cssText = `
      padding: 1rem 2rem;
      fontSize: 16px;
      backgroundColor: #2196F3;
      color: white;
      border: 1px solid #1976D2;
      borderRadius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    `;

    button.addEventListener("click", () => {
      count++;
      button.textContent = `Island2 - Interactive! (${count})`;
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 100);
    });

    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = "#1976D2";
    });

    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = "#2196F3";
    });

    domNode.innerHTML = "";
    domNode.appendChild(button);
  }
}, 2000); // 2 segundos de delay
