interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SortSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      data-testid="sort-select"
      aria-label="Sort items"
    >
      <option value="created_at">Newest</option>
      <option value="priority">Priority (High → Low)</option>
    </select>
  )
}
