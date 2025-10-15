import type { Todo } from '../utils'
import { defineEventHandler } from 'h3'
import { readTodos } from '../utils/kv'

export default defineEventHandler(async () => {
  const todos: Todo[] = await readTodos()
  return { statusCode: 200, message: 'Success', todos }
})
