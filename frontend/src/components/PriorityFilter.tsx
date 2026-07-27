import type { ItemPriority } from '../types'

interface Props {
  value: ItemPriority | 'all'
  onChange: (value: ItemPriority | 'all') => void
}

export default function PriorityFilter({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as ItemPriority | 'all')}
      className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      data-testid="priority-filter"
      aria-label="Filter by priority"
    >
      <option value="all">All priorities</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  )
}
