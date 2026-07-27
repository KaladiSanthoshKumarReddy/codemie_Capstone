import { Router, Response } from 'express'
import { z } from 'zod'
import { getDb } from '../db/init'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

const prioritySchema = z.enum(['high', 'medium', 'low'])

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: prioritySchema.optional(),
})

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  priority: prioritySchema.optional(),
})

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(200).optional(),
  status: z.enum(['all', 'active', 'completed', 'archived']).optional(),
  priority: z.enum(['all', ...prioritySchema.options]).optional(),
  sort: z.enum(['created_at', 'priority']).optional(),
})

// GET /api/items?page=1&limit=10&search=text&status=active&priority=high&sort=priority
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const parsedQuery = querySchema.safeParse(req.query)
    if (!parsedQuery.success) {
      return res.status(400).json({ success: false, error: 'Invalid query params' })
    }

    const { page, limit, search, status, priority, sort } = parsedQuery.data
    const offset = (page - 1) * limit

    const db = getDb()

  const whereClauses: string[] = ['user_id = ?']
  const args: (string | number)[] = [req.userId]

  if (search) {
    whereClauses.push('(title LIKE ? OR description LIKE ?)')
    args.push(`%${search}%`, `%${search}%`)
  }

  if (status && status !== 'all') {
    whereClauses.push('status = ?')
    args.push(status)
  }

  if (priority && priority !== 'all') {
    whereClauses.push('priority = ?')
    args.push(priority)
  }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countResult = await db.execute({ sql: `SELECT COUNT(*) as total FROM items ${where}`, args })
    const total = Number((countResult.rows[0] as unknown as { total: number }).total)

    const orderBy = sort === 'priority'
      ? "ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END, created_at DESC"
      : 'ORDER BY created_at DESC'

    const itemsResult = await db.execute({
      sql: `SELECT * FROM items ${where} ${orderBy} LIMIT ? OFFSET ?`,
      args: [...args, limit, offset],
    })

    return res.json({
      success: true,
      data: itemsResult.rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch items' })
  }
})

// POST /api/items
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const parsed = createSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Invalid input' })
    }

    const { title, description, priority } = parsed.data
    const db = getDb()
    const result = await db.execute({
      sql: 'INSERT INTO items (title, description, priority, user_id) VALUES (?, ?, ?, ?)',
      args: [title, description ?? null, priority ?? 'medium', req.userId],
    })
    return res.status(201).json({ success: true, data: { id: Number(result.lastInsertRowid) } })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to create item' })
  }
})

// PATCH /api/items/:id  [55187]
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const parsed = patchSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Invalid input' })
    }

    const { title, description, status, priority } = parsed.data
    if (!title && description === undefined && !status && !priority) {
      return res.status(400).json({ success: false, error: 'Nothing to update' })
    }

    const db = getDb()

    const setClauses: string[] = ['updated_at = CURRENT_TIMESTAMP']
    const args: (string | number)[] = []
    if (title)                     { setClauses.push('title = ?');       args.push(title) }
    if (description !== undefined) { setClauses.push('description = ?'); args.push(description) }
    if (status)                    { setClauses.push('status = ?');      args.push(status) }
    if (priority)                  { setClauses.push('priority = ?');    args.push(priority) }
    args.push(req.params.id, req.userId)

    const result = await db.execute({
      sql: `UPDATE items SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`,
      args,
    })

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' })
    }

    const updated = await db.execute({
      sql: 'SELECT * FROM items WHERE id = ? AND user_id = ?',
      args: [req.params.id, req.userId],
    })
    return res.json({ success: true, data: updated.rows[0] })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to update item' })
  }
})

// DELETE /api/items/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const db = getDb()
    const result = await db.execute({
      sql: 'DELETE FROM items WHERE id = ? AND user_id = ?',
      args: [req.params.id, req.userId],
    })
    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' })
    }
    return res.json({ success: true, data: { deleted: true } })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to delete item' })
  }
})

export default router
