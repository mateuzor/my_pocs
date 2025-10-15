import type { Todo } from '../../utils'
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'
import { readTodos } from '../../utils/kv'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const todos: Todo[] = await readTodos()
  const single = todos.find(t => t.id === id)

  if (!single) {
    setResponseStatus(event, 404)
    return { statusCode: 404, message: 'Todo item not found', data: {} }
  }
  return { statusCode: 200, message: 'Success', data: single }
})
