// FILE DROP — receive files dragged from the operating system into the page.
// dataTransfer.files is a FileList (same as <input type="file">) — each File
// has name, size, type, and you can read the contents via .text() / .arrayBuffer().

export function makeFileDrop(zone: HTMLElement, list: HTMLElement) {
  // We must preventDefault on dragenter/dragover/drop AT THE WINDOW LEVEL too,
  // otherwise the browser will navigate away to display the dropped file.
  ['dragenter', 'dragover', 'drop'].forEach((evt) => {
    window.addEventListener(evt, (e) => e.preventDefault());
  });

  zone.addEventListener('dragenter', () => zone.classList.add('over'));
  zone.addEventListener('dragleave', (e) => {
    if (!zone.contains(e.relatedTarget as Node)) zone.classList.remove('over');
  });

  zone.addEventListener('drop', async (e) => {
    zone.classList.remove('over');
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    list.innerHTML = '';

    // FileList behaves like an array — has length and indexed access
    for (const file of Array.from(files)) {
      const li = document.createElement('li');
      const size = (file.size / 1024).toFixed(2);
      li.textContent = `${file.name} — ${file.type || 'unknown'} — ${size} KB`;
      list.appendChild(li);
    }
  });
}
