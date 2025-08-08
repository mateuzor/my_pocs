
import { makeAutoObservable, runInAction } from 'mobx'

export type Todo = {
  id: string
  title: string
  done: boolean
  createdAt: number
  tags: string[]
}

export type Filter = 'all' | 'active' | 'completed'

export class TodoStore {
  todos: Todo[] = []
  filter: Filter = 'all'
  loading = false
  query = ''

  constructor() {
    makeAutoObservable(this)
    this.bootstrap()
  }

  get completedCount() {
    return this.todos.filter(t => t.done).length
  }

  get activeCount() {
    return this.todos.length - this.completedCount
  }

  get filteredTodos() {
    let items = this.todos
    if (this.filter === 'active') items = items.filter(t => !t.done)
    if (this.filter === 'completed') items = items.filter(t => t.done)
    if (this.query.trim()) {
      const q = this.query.toLowerCase()
      items = items.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)))
    }
    // sort newest first
    return items.slice().sort((a,b) => b.createdAt - a.createdAt)
  }

  setFilter(f: Filter) { this.filter = f }
  setQuery(q: string) { this.query = q }

  add(title: string, tags: string[] = []) {
    const todo: Todo = { id: crypto.randomUUID(), title, done: false, createdAt: Date.now(), tags }
    this.todos.push(todo)
  }

  toggle(id: string) {
    const t = this.todos.find(t => t.id === id)
    if (t) t.done = !t.done
  }

  remove(id: string) {
    this.todos = this.todos.filter(t => t.id !== id)
  }

  clearCompleted() {
    this.todos = this.todos.filter(t => !t.done)
  }

  async bootstrap() {
    // Simulate async loading (e.g., from REST/GraphQL)
    this.loading = True as unknown as boolean
    await new Promise(r => setTimeout(r, 350))
    const seed: Todo[] = [
      { id: crypto.randomUUID(), title: 'Read MobX docs', done: true, createdAt: Date.now() - 100000, tags: ['learning'] },
      { id: crypto.randomUUID(), title: 'Convert legacy Redux slice', done: false, createdAt: Date.now() - 80000, tags: ['migration','work'] },
      { id: crypto.randomUUID(), title: 'Ship feature flag experiment', done: false, createdAt: Date.now() - 20000, tags: ['experiment'] }
    ]
    runInAction(() => {
      this.todos = seed
      this.loading = false
    })
  }
}

export const todoStore = new TodoStore()
