function ShareButtons({ title }) {

  function copyLink() {

    navigator.clipboard.writeText(window.location.href)

    alert('Link berhasil disalin!')
  }

  return (

    <div className="mt-10 flex flex-wrap gap-3">

      <button
        onClick={copyLink}
        className="rounded bg-gray-900 px-4 py-2 text-white"
      >
        Copy Link
      </button>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noreferrer"
        className="rounded bg-green-600 px-4 py-2 text-white"
      >
        WhatsApp
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noreferrer"
        className="rounded bg-sky-500 px-4 py-2 text-white"
      >
        X
      </a>

    </div>

  )

}

export default ShareButtons