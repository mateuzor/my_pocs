// SORTABLE LIST — drag <li> elements within the same parent to reorder.
//
// The HTML5 Drag and Drop event flow:
//   dragstart   (on source)     → set data, mark as dragging
//   dragenter   (on target)     → visual feedback
//   dragover    (on target)     → MUST preventDefault() to allow drop
//   dragleave   (on target)     → remove visual feedback
//   drop        (on target)     → do the actual reorder, also preventDefault
//   dragend     (on source)     → cleanup, always fires

export function makeSortable(list: HTMLElement) {
  let dragged: HTMLElement | null = null;

  list.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'LI') return;
    dragged = target;
    dragged.classList.add('dragging');
    // dataTransfer is required for the drag to actually start in some browsers.
    // The data we set here isn't used in this demo, but it MUST be present.
    e.dataTransfer?.setData('text/plain', target.dataset.id ?? '');
    e.dataTransfer!.effectAllowed = 'move';
  });

  list.addEventListener('dragover', (e) => {
    // CRITICAL — without preventDefault on dragover, drop will NEVER fire.
    // This is the "make the element a drop target" signal.
    e.preventDefault();
    const target = (e.target as HTMLElement).closest('li');
    if (!target || target === dragged) return;

    // Decide whether to insert before or after the target based on cursor Y
    const rect = target.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    list.insertBefore(dragged!, before ? target : target.nextSibling);
  });

  list.addEventListener('dragend', () => {
    dragged?.classList.remove('dragging');
    dragged = null;
    // After the user releases, the DOM order IS the new state — read it back:
    const order = Array.from(list.querySelectorAll<HTMLElement>('li[data-id]'))
      .map((el) => el.dataset.id);
    console.log('New order:', order);
  });
}
