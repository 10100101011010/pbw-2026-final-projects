import { Link } from 'react-router-dom'

// items: [{ label, to }]. Last item is rendered as plain text (current page).
function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label}>
            {isLast || !item.to ? (
              <span>{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:underline">
                {item.label}
              </Link>
            )}
            {!isLast && <span className="mx-1">/</span>}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
