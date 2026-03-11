import { useState, useRef } from 'react';

interface Task {
  id: number;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

const INITIAL_TASKS: Task[] = [
  { id: 1, text: 'Design the API', priority: 'high' },
  { id: 2, text: 'Write unit tests', priority: 'medium' },
  { id: 3, text: 'Update documentation', priority: 'low' },
  { id: 4, text: 'Code review', priority: 'medium' },
  { id: 5, text: 'Deploy to staging', priority: 'high' },
];

const PRIORITY_COLORS = { high: '#fed7d7', medium: '#fefcbf', low: '#c6f6d5' };

export function DragDropSortable() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const dragIndex = useRef<number | null>(null); // index being dragged
  const overIndex = useRef<number | null>(null); // index being hovered over

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    overIndex.current = index;
  };

  // On drop: reorder the array by moving dragIndex to overIndex position
  const handleDrop = () => {
    const from = dragIndex.current;
    const to = overIndex.current;

    if (from === null || to === null || from === to) return;

    setTasks(prev => {
      const updated = [...prev];
      // Remove the dragged item and insert it at the target position
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });

    dragIndex.current = null;
    overIndex.current = null;
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Drag and Drop — Sortable List</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Drag tasks to reorder them.</p>

      <div style={{ marginTop: '1rem', maxWidth: '400px' }}>
        {tasks.map((task, index) => (
          <div
            key={task.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragOver={e => e.preventDefault()} // must prevent default to allow drop
            onDrop={handleDrop}
            style={{
              background: PRIORITY_COLORS[task.priority],
              padding: '0.6rem 1rem',
              marginBottom: '0.4rem',
              borderRadius: '6px',
              cursor: 'grab',
              userSelect: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <span>☰ {task.text}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{task.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
