import type { Todo } from "../utils";
import { defineEventHandler, readBody, setResponseStatus } from "h3";
import { readTodos, writeTodos } from "../utils/kv";
import { createTodoSchema } from "../utils/validation";
import { logger } from "../utils/logger";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate input with Zod
    const result = createTodoSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten();
      setResponseStatus(event, 400);
      logger.warn({ errors }, "Invalid request body for /todos POST");
      return { statusCode: 400, message: "Validation failed", errors };
    }

    const input = result.data;

    // Prepare Todo and save
    const list: Todo[] = await readTodos();
    const newTodo: Todo = {
      id: Date.now(),
      todo: input.todo,
      completed: input.completed,
    };
    list.push(newTodo);
    await writeTodos(list);

    //  Log success
    logger.info({ todo: newTodo }, "New todo created successfully");

    setResponseStatus(event, 201);
    return {
      statusCode: 201,
      message: "Todo added successfully",
      data: newTodo,
    };
  } catch (err) {
    // Catch unexpected errors
    logger.error({ err }, "Unhandled error in /todos POST");
    setResponseStatus(event, 500);
    return { statusCode: 500, message: "Internal server error" };
  }
});
