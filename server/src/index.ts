import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { requireAuth, type AuthedRequest } from './middleware/auth.js'

const app = express()

app.use(cors())
app.use(express.json())

// Public health check.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Protected sample route — proves JWT verification works end to end.
// Real project/task CRUD routes will be added here next.
app.get('/api/me', requireAuth, (req: AuthedRequest, res) => {
  res.json({ userId: req.userId })
})

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
