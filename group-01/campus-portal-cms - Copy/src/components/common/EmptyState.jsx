// Shown when a list/collection has no data to display.
function EmptyState({ title = 'No data', description = '' }) {
  return (
    <div className="flex flex-col items-center gap-1 py-12 text-center">
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  )
}

export default EmptyState
