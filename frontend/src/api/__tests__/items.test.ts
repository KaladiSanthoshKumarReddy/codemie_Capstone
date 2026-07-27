import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock is hoisted above imports, so mock functions must be created with
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
import { createItem, updateItem, deleteItem } from '../items'


// ---------------------------------------------------------------------------
// createItem
// ---------------------------------------------------------------------------
describe('createItem', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('posts to /items with title and description and returns the new id', async () => {
    postMock.mockResolvedValueOnce({
      data: { success: true, data: { id: 42 } },
    })

    const result = await createItem('Test title', 'Test description')

    expect(client.post).toHaveBeenCalledWith('/items', {
      title: 'Test title',
      description: 'Test description',
      priority: undefined,
    })
    expect(result).toEqual({ id: 42 })
  })

  it('posts without description when omitted', async () => {
    postMock.mockResolvedValueOnce({
      data: { success: true, data: { id: 1 } },
    })

    await createItem('Title only')

    expect(client.post).toHaveBeenCalledWith('/items', {
      title: 'Title only',
      description: undefined,
      priority: undefined,
    })
  })

  it('rejects when the request fails', async () => {
    postMock.mockRejectedValueOnce(new Error('Network error'))

    await expect(createItem('Failing item')).rejects.toThrow('Network error')
  })
})

// ---------------------------------------------------------------------------
// updateItem
// ---------------------------------------------------------------------------
describe('updateItem', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('patches /items/:id with a status patch and returns the updated item', async () => {
    const mockItem = {
      id: 5, title: 'My item', status: 'completed' as const,
      priority: 'medium' as const,
      description: null, user_id: 1,
      created_at: '2024-01-01', updated_at: '2024-01-02',
    }
    patchMock.mockResolvedValueOnce({
      data: { success: true, data: mockItem },
    })

    const result = await updateItem(5, { status: 'completed' })

    expect(client.patch).toHaveBeenCalledWith('/items/5', { status: 'completed' })
    expect(result).toEqual(mockItem)
  })

  it('patches /items/:id with a title patch', async () => {
    const mockItem = {
      id: 3, title: 'New Title', status: 'active' as const,
      priority: 'low' as const,
      description: null, user_id: 1,
      created_at: '2024-01-01', updated_at: '2024-01-02',
    }
    patchMock.mockResolvedValueOnce({
      data: { success: true, data: mockItem },
    })

    const result = await updateItem(3, { title: 'New Title' })

    expect(client.patch).toHaveBeenCalledWith('/items/3', { title: 'New Title' })
    expect(result.title).toBe('New Title')
  })

  it('patches /items/:id with an archived status', async () => {
    const mockItem = {
      id: 7, title: 'Old item', status: 'archived' as const,
      priority: 'high' as const,
      description: null, user_id: 1,
      created_at: '2024-01-01', updated_at: '2024-01-03',
    }
    patchMock.mockResolvedValueOnce({
      data: { success: true, data: mockItem },
    })

    const result = await updateItem(7, { status: 'archived' })

    expect(client.patch).toHaveBeenCalledWith('/items/7', { status: 'archived' })
    expect(result.status).toBe('archived')
  })

  it('rejects when the request fails', async () => {
    patchMock.mockRejectedValueOnce(new Error('Server error'))

    await expect(updateItem(1, { status: 'active' })).rejects.toThrow('Server error')
  })
})

// ---------------------------------------------------------------------------
// deleteItem
// ---------------------------------------------------------------------------
describe('deleteItem', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls DELETE /items/:id', async () => {
    deleteMock.mockResolvedValueOnce({ data: { success: true } })

    await deleteItem(7)

    expect(client.delete).toHaveBeenCalledWith('/items/7')
  })

  it('resolves to undefined on success', async () => {
    deleteMock.mockResolvedValueOnce({ data: { success: true } })

    const result = await deleteItem(10)

    expect(result).toBeUndefined()
  })

  it('rejects when the request fails', async () => {
    deleteMock.mockRejectedValueOnce(new Error('Not found'))

    await expect(deleteItem(99)).rejects.toThrow('Not found')
  })
})
