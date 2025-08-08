
import React from 'react'
import { observer } from 'mobx-react-lite'
import { todoStore } from '../stores/TodoStore'
import { TodoList } from './TodoList'

export const App = observer(function App() {
  const s = todoStore

  return (
    <div className="container">
      <header className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1>MobX State — POC</h1>
          <p className="muted">Reactive Todo demo with filters, search and computed state.</p>
        </div>
        <span className="pill">{s.completedCount} done • {s.activeCount} left</span>
      </header>

      <section className="row" style={{ marginTop: 16 }}>
        <input
          placeholder="Add a new todo... (press Enter)"
          aria-label="new-todo-input"
          onKeyDown={(e) => {
            const el = e.currentTarget
            if (e.key === 'Enter' && el.value.trim()) {
              s.add(el.value.trim())
              el.value = ''
            }
          }}
          style={{ flex: 1 }}
        />
        <select value={s.filter} onChange={e => s.setFilter(e.target.value as any)} aria-label="filter-select">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <input
          placeholder="Search..."
          aria-label="search-input"
          value={s.query}
          onChange={e => s.setQuery(e.target.value)}
        />
        <button onClick={() => s.clearCompleted()} aria-label="clear-completed">Clear completed</button>
      </section>

      <TodoList />
      <p className="hint">
        Try: add tasks, toggle them, filter by status, search by title or tag (e.g., "work").
        Notice how the list and the header counters react automatically to changes.
      </p>
    </div>
  )
})
