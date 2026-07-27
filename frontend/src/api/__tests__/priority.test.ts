import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock is hoisted above imports, so mock functions must be created via
// vi.hoisted() to ensure they exist when the factory runs.
const { getMock, postMock, patchMock, deleteMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  patchMock: vi.fn(),
  deleteMock: vi.fn(),
}))

vi.mock('../client', () => ({
  default: {
    get: getMock,
    post: postMock,
    patch: patchMock,
    delete: deleteMock,
  },
}))

// Import after mocking the axios client.
import client from '../client'
import { createItem, updateItem } from '../items'

// ---------------------------------------------------------------------------
// createItem with explicit priority
// ---------------------------------------------------------------------------
describe('createItem – priority field', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('sends priority="high" to POST /items when explicitly provided', async () => {
    postMock.mockResolvedValueOnce({
      data: { success: true, data: { id: 10 } },
    })

    const result = await createItem('High prio task', undefined, 'high')

    expect(client.post).toHaveBeenCalledWith('/items', {
      title: 'High prio task',
      description: undefined,
      priority: 'high',
    })
    expect(result).toEqual({ id: 10 })
  })

  it('sends priority="medium" to POST /items when explicitly provided', async () => {
    postMock.mockResolvedValueOnce({
      data: { success: true, data: { id: 11 } },
    })

    await createItem('Medium prio task', 'Some desc', 'medium')

    expect(client.post).toHaveBeenCalledWith('/items', {
      title: 'Medium prio task',
      description: 'Some desc',
      priority: 'medium',
    })
  })

  it('sends priority="low" to POST /items when explicitly provided', async () => {
    postMock.mockResolvedValueOnce({
      data: { success: true, data: { id: 12 } },
    })

    await createItem('Low prio task', undefined, 'low')

    expect(client.post).toHaveBeenCalledWith('/items', {
      title: 'Low prio task',
      description: undefined,
      priority: 'low',
    })
  })
})

// ---------------------------------------------------------------------------
// updateItem with priority patch
// ---------------------------------------------------------------------------
describe('updateItem – priority patch', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('sends PATCH /items/:id with { priority: "low" } and returns updated item', async () => {
    const mockItem = {
      id: 5,
      title: 'Task A',
      status: 'active' as const,
      priority: 'low' as const,
      description: null,
      user_id: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-02',
    }
    patchMock.mockResolvedValueOnce({
      data: { success: true, data: mockItem },
    })

    const result = await updateItem(5, { priority: 'low' })

    expect(client.patch).toHaveBeenCalledWith('/items/5', { priority: 'low' })
    expect(result.priority).toBe('low')
  })

  it('sends PATCH /items/:id with { priority: "high" } and returns item with priority="high"', async () => {
    const mockItem = {
      id: 7,
      title: 'Task B',
      status: 'active' as const,
      priority: 'high' as const,
      description: null,
      user_id: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-03',
    }
    patchMock.mockResolvedValueOnce({
      data: { success: true, data: mockItem },
    })

    const result = await updateItem(7, { priority: 'high' })

    expect(client.patch).toHaveBeenCalledWith('/items/7', { priority: 'high' })
    expect(result.priority).toBe('high')
    expect(result).toEqual(mockItem)
  })

  it('sends PATCH /items/:id with { priority: "medium" } and returns updated item', async () => {
    const mockItem = {
      id: 9,
      title: 'Task C',
      status: 'completed' as const,
      priority: 'medium' as const,
      description: 'Some description',
      user_id: 2,
      created_at: '2024-02-01',
      updated_at: '2024-02-05',
    }
    patchMock.mockResolvedValueOnce({
      data: { success: true, data: mockItem },
    })

    const result = await updateItem(9, { priority: 'medium' })

    expect(client.patch).toHaveBeenCalledWith('/items/9', { priority: 'medium' })
    expect(result.priority).toBe('medium')
  })

  it('can patch both title and priority in one call', async () => {
    const mockItem = {
      id: 15,
      title: 'Updated Title',
      status: 'active' as const,
      priority: 'high' as const,
      description: null,
      user_id: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-04',
    }
    patchMock.mockResolvedValueOnce({
      data: { success: true, data: mockItem },
    })

    const result = await updateItem(15, { title: 'Updated Title', priority: 'high' })

    expect(client.patch).toHaveBeenCalledWith('/items/15', {
      title: 'Updated Title',
      priority: 'high',
    })
    expect(result.title).toBe('Updated Title')
    expect(result.priority).toBe('high')
  })

  it('rejects when the PATCH request fails', async () => {
    patchMock.mockRejectedValueOnce(new Error('Network error'))

    await expect(updateItem(3, { priority: 'low' })).rejects.toThrow('Network error')
  })
})
