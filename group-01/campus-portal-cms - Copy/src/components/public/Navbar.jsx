import { Link } from 'react-router-dom'

import { PUBLIC_ROUTES } from '../../constants/routes.js'
import { useCategories } from '../../hooks/useCategories.js'

function Navbar() {

  const {

    categories,

    loading,

  } = useCategories()

  return (

    <header className="border-b bg-white">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        <Link

          to={PUBLIC_ROUTES.HOME}

          className="text-xl font-bold"

        >

          Campus Portal

        </Link>

        <div className="flex flex-wrap gap-6 text-sm">

          {

            loading

              ? (

                <span>

                  Loading...

                </span>

              )

              : (

                categories.map(category => (

                  <Link

                    key={category.id}

                    to={`/category/${category.slug}`}

                    className="transition hover:text-blue-600"

                  >

                    {category.name}

                  </Link>

                ))

              )

          }

        </div>

      </nav>

    </header>

  )

}

export default Navbar