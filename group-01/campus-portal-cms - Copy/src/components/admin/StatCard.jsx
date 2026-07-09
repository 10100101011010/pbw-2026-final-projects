function StatCard({
  title,
  value,
  color = 'bg-blue-500',
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <div className={`mb-4 h-2 w-14 rounded ${color}`} />

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold">
        {value}
      </h2>

    </div>
  )
}

export default StatCard