// Reusable section heading used above lists of posts.
function SectionTitle({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  )
}

export default SectionTitle
