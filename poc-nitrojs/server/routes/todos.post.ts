import type { Todo } from '../utils'
import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { readTodos, writeTodos } from '../utils/kv'

export default defineEventHandler(async (event) => {
  const { todo, completed } = await readBody(event)

  if (!todo || completed == null) {
    setResponseStatus(event, 400)
    return { statusCode: 400, message: 'Both Todo and Completed fields should have a value set' }
  }

  const completedStr = String(completed)
  if (completedStr !== 'true' && completedStr !== 'false') {
    setResponseStatus(event, 400)
    return { statusCode: 400, message: 'The value of completed must either be true or false' }
  }

  const list: Todo[] = await readTodos()
  const newTodo: Todo = { id: Date.now(), todo: String(todo), completed: completedStr as 'true' | 'false' }
  list.push(newTodo)
  await writeTodos(list)

  setResponseStatus(event, 201)
  return { statusCode: 201, message: 'Todo added successfully', data: { ...newTodo } }
})
