const observedIslands = {};

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const islandName = entry.target.dataset.island;

      if (!observedIslands[islandName]) {
        console.log(`📦 Loading chunk: ${islandName}.js`);

        entry.target.innerHTML = `<div style="color: orange;">📦 Loading chunk ${islandName}.js...</div>`;

        import(`./islands/${islandName}.js`);

        observedIslands[islandName] = true;
        observer.unobserve(entry.target);
      }
    }
  }
});

document
  .querySelectorAll("[data-island]")
  .forEach((el) => observer.observe(el));
