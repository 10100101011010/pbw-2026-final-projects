// Small colored badge showing a post's category name.
function CategoryBadge({ name }) {
  if (!name) return null
  return (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
      {name}
    </span>
  )
}

export default CategoryBadge
