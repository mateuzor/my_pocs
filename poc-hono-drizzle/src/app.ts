import { Hono } from 'hono'
import { userRoutes } from './routes/users'

const app = new Hono()

app.route('/users', userRoutes)

export default app
