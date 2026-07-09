// Large banner used on the Home page.
function HeroBanner({ title, subtitle }) {
  return (
    <section className="bg-gray-900 px-4 py-16 text-center text-white">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-gray-300">{subtitle}</p>}
    </section>
  )
}

export default HeroBanner
