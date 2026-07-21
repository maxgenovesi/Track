import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../supabase.js'

// Requests that pass requireAuth carry the verified user id.
export interface AuthedRequest extends Request {
  userId?: string
}

// Verifies the Supabase JWT sent as `Authorization: Bearer <token>`.
// On success, attaches the user id to the request and continues.
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.userId = data.user.id
  next()
}
