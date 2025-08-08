
import React from 'react'
import { observer } from 'mobx-react-lite'
import { todoStore, Todo } from '../stores/TodoStore'

export const TodoRow = observer(function TodoRow({ todo }: { todo: Todo }) {
  const s = todoStore
  return (
    <div className="card" role="listitem" aria-label="todo-item">
      <label className="row" style={{ gap: 8 }}>
        <input
          type="checkbox"
          checked={todo.done}
          aria-label="toggle-todo"
          onChange={() => s.toggle(todo.id)}
        />
        <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.title}</span>
      </label>
      <div className="row">
        {todo.tags.map(tag => <span key={tag} className="pill" aria-label="tag">#{tag}</span>)}
        <button onClick={() => s.remove(todo.id)} aria-label="delete-todo" title="Delete">🗑️</button>
      </div>
    </div>
  )
})
