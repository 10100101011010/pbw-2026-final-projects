function Pagination({
  page,
  total,
  limit,
  onPageChange,
}) {

  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  return (

    <div className="mt-10 flex items-center justify-center gap-2">

      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ← Previous
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => {

          const pageNumber = index + 1

          return (

            <button
              key={pageNumber}
              type="button"
              onClick={() =>
                onPageChange(pageNumber)
              }
              className={`rounded px-4 py-2 border transition ${
                page === pageNumber
                  ? 'bg-gray-900 text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {pageNumber}
            </button>

          )

        }
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next →
      </button>

    </div>

  )

}

export default Pagination