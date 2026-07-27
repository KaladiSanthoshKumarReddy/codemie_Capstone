export type ItemPriority = 'high' | 'medium' | 'low'

export interface Item {
  id: number
  title: string
  description: string | null
  status: 'active' | 'completed' | 'archived'
  priority: ItemPriority
  user_id: number | null
  created_at: string
  updated_at: string | null
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ItemsResponse {
  success: boolean
  data: Item[]
  meta: PaginationMeta
}

export type ItemStatus = 'active' | 'completed' | 'archived' | 'all'
