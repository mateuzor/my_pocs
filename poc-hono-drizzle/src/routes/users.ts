import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../db/client'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

export const userRoutes = new Hono()

const userSchema = z.object({
  name: z.string(),
  email: z.string().email()
})

userRoutes.get('/', async (c) => {
  const allUsers = await db.select().from(users)
  return c.json(allUsers)
})

userRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const user = await db.select().from(users).where(eq(users.id, id))
  if (!user.length) return c.notFound()
  return c.json(user[0])
})

userRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = userSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400)
  const [newUser] = await db.insert(users).values(parsed.data).returning()
  return c.json(newUser)
})

userRoutes.put('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json()
  const parsed = userSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.format() }, 400)
  const updated = await db.update(users).set(parsed.data).where(eq(users.id, id)).returning()
  return c.json(updated[0])
})

userRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await db.delete(users).where(eq(users.id, id))
  return c.json({ success: true })
})
