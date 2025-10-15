import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import type { Todo } from './index'

type KVSchema = { todos: Todo[] }

export const kv = createStorage<KVSchema>({
  driver: fsDriver({ base: '.data/kv' })
})

export async function readTodos(): Promise<Todo[]> {
  return (await kv.getItem('todos')) ?? []
}

export async function writeTodos(items: Todo[]): Promise<void> {
  await kv.setItem('todos', items)
}
