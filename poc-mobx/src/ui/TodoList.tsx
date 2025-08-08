
import React from 'react'
import { observer } from 'mobx-react-lite'
import { todoStore } from '../stores/TodoStore'
import { TodoRow } from './TodoRow'

export const TodoList = observer(function TodoList() {
  const s = todoStore
  if (s.loading) return <p className="muted">Loading data…</p>
  if (s.filteredTodos.length === 0) return <p className="muted">No todos match the current filters.</p>
  return (
    <div className="list" role="list">
      {s.filteredTodos.map(t => <TodoRow key={t.id} todo={t} />)}
    </div>
  )
})
