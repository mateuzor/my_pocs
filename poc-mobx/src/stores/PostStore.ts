import { makeAutoObservable, runInAction } from 'mobx'

interface Post { id: number; title: string; body: string }

export class PostStore {
  posts: Post[] = []
  status: 'idle' | 'loading' | 'done' | 'error' = 'idle'
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // In MobX, state mutations that happen after an await must be wrapped in runInAction.
  // Without it, MobX strict mode throws because mutations must happen inside actions.
  async fetchPosts() {
    this.status = 'loading'
    this.error = null

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Post[] = await res.json()

      runInAction(() => {
        this.posts = data
        this.status = 'done'
      })
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message
        this.status = 'error'
      })
    }
  }

  get isEmpty() { return this.posts.length === 0 }
}

export const postStore = new PostStore()
