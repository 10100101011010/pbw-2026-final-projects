// Generic reusable data table.

function DataTable({
  columns = [],
  rows = [],
  loading = false,
  renderActions,
}) {
  if (loading) {
    return (
      <div className="rounded-lg border p-6 text-center">
        Loading...
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-gray-500">
        No data found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold"
              >
                {col.label}
              </th>
            ))}

            {renderActions && (
              <th className="px-4 py-3 text-center">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-t hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3"
                >
                  {row[col.key]}
                </td>
              ))}

              {renderActions && (
                <td className="px-4 py-3 text-center">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable