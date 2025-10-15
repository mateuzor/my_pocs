import type { Todo } from '../../utils'
import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'
import { readTodos, writeTodos } from '../../utils/kv'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { todo, completed } = await readBody(event)

  if (todo == null && completed == null) {
    setResponseStatus(event, 400)
    return { statusCode: 400, message: 'Either Todo or Completed should have a value set' }
  }

  const list: Todo[] = await readTodos()
  const idx = list.findIndex(t => t.id === id)
  if (idx === -1) {
    setResponseStatus(event, 404)
    return { statusCode: 404, message: 'Todo not found', data: {} }
  }

  if (todo != null) list[idx].todo = String(todo)
  if (completed != null) {
    const c = String(completed)
    if (c !== 'true' && c !== 'false') {
      setResponseStatus(event, 400)
      return { statusCode: 400, message: 'The value of completed must either be true or false' }
    }
    list[idx].completed = c as 'true' | 'false'
  }

  await writeTodos(list)
  return { statusCode: 200, message: 'Todo updated successfully', data: { ...list[idx] } }
})
