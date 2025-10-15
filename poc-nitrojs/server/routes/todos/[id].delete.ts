import type { Todo } from '../../utils'
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'
import { readTodos, writeTodos } from '../../utils/kv'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const list: Todo[] = await readTodos()
  const idx = list.findIndex(t => t.id === id)

  if (idx === -1) {
    setResponseStatus(event, 404)
    return { statusCode: 404, message: 'Todo not found', data: {} }
  }

  const [deleted] = list.splice(idx, 1)
  await writeTodos(list)

  return { statusCode: 200, message: 'Todo successfully deleted', data: { ...deleted } }
})
