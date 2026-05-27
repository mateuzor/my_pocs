// KANBAN — drag cards between columns. Two-level setup:
//   source: each .card has draggable="true"
//   target: each .column receives drop events

export function makeKanban(board: HTMLElement) {
  // Bind handlers to every column once on load
  for (const column of board.querySelectorAll<HTMLElement>('.column')) {
    column.addEventListener('dragenter', (e) => {
      e.preventDefault();
      column.classList.add('over');
    });

    column.addEventListener('dragover', (e) => {
      // Must preventDefault here so drop fires
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move';
    });

    column.addEventListener('dragleave', (e) => {
      // dragleave fires when leaving the column OR any of its descendants.
      // Check that we actually left the column itself, not just a card inside.
      if (!column.contains(e.relatedTarget as Node)) {
        column.classList.remove('over');
      }
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('over');

      const cardId = e.dataTransfer!.getData('text/card-id');
      if (!cardId) return;

      const card = document.querySelector<HTMLElement>(`.card[data-id="${cardId}"]`);
      if (card) {
        column.appendChild(card);
        console.log(`Card "${cardId}" moved to column "${column.dataset.status}"`);
      }
    });
  }

  // Card source handlers — delegated to the board
  board.addEventListener('dragstart', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.card');
    if (!card) return;
    card.classList.add('dragging');
    // Use a custom mime so this doesn't conflict with other drag operations.
    // dataTransfer is the channel between source and target — only string data.
    e.dataTransfer?.setData('text/card-id', card.dataset.id ?? '');
    e.dataTransfer!.effectAllowed = 'move';
  });

  board.addEventListener('dragend', (e) => {
    (e.target as HTMLElement).closest('.card')?.classList.remove('dragging');
  });
}
