import {
  FaNewspaper,
  FaCalendarAlt,
  FaGraduationCap,
  FaBullhorn,
} from "react-icons/fa";
import { useSettings } from "../../hooks/useSettings.js";
import HeroBanner from "../../components/public/HeroBanner.jsx";
import SearchBar from "../../components/public/SearchBar.jsx";
import SectionTitle from "../../components/public/SectionTitle.jsx";
import PostCard from "../../components/public/PostCard.jsx";
import CategorySection from "../../components/public/CategorySection.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Pagination from "../../components/common/Pagination.jsx";

import { useCategories } from "../../hooks/useCategories.js";
import { useLatestPosts } from "../../hooks/usePublicPosts.js";
import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

function HomePage() {
  const {
    posts,
    count,
    page,
    setPage,
    loading,
  } = useLatestPosts(6);

  const {
    categories,
    loading: loadingCategories,
  } = useCategories();

  const {
    settings,
    loading: loadingSettings,
  } = useSettings();

    if (loadingSettings) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
      }}
      className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500"
    >

      {/* ======================================= */}
      {/* HERO */}
      {/* ======================================= */}

      <HeroBanner
          title={settings.site_name}
          subtitle={settings.site_description}
      />

      {/* ======================================= */}
      {/* SEARCH */}
      {/* ======================================= */}

      <div className="relative z-20 mx-auto -mt-12 max-w-6xl px-4">

        <div
          className="
          rounded-3xl
          border
          border-slate-200
          bg-white/90
          p-6
          shadow-2xl
          backdrop-blur-xl
          transition
          duration-300

          dark:border-slate-700
          dark:bg-slate-900/90
        "
        >
          <SearchBar />
        </div>

      </div>

      {/* ======================================= */}
      {/* CONTENT */}
      {/* ======================================= */}

      <div className="mx-auto max-w-7xl px-4 py-16">

        {/* ======================================= */}
        {/* STATISTICS */}
        {/* ======================================= */}

        <div className="mb-20">

          <div className="mb-10 text-center">

            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Portal Statistics
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Ringkasan informasi terbaru dari Portal Gunadarma.
            </p>

          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Card 1 */}

            <div
              className="
                rounded-3xl
                bg-white
                p-8
                shadow-lg
                dark:bg-slate-900
              "
            >

              <div
                className="
                  inline-flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-100
                  text-3xl
                  text-blue-600
                "
              >
                <FaNewspaper />
              </div>

              <h2 className="mt-6 text-4xl font-extrabold text-blue-600">
                {count}+
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-300">
                Published Articles
              </p>

            </div>

            {/* Card 2 */}

            <div
              className="
                rounded-3xl
                bg-white
                p-8
                shadow-lg
                dark:bg-slate-900
              "
            >

              <div
                className="
                  inline-flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-yellow-100
                  text-3xl
                  text-yellow-500
                "
              >
                <FaCalendarAlt />
              </div>

              <h2 className="mt-6 text-4xl font-extrabold text-yellow-500">
                {categories.length}
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-300">
                Categories
              </p>

            </div>

            {/* Card 3 */}

            <div
              className="
                rounded-3xl
                bg-white
                p-8
                shadow-lg
                dark:bg-slate-900
              "
            >

              <div
                className="
                  inline-flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-red-100
                  text-3xl
                  text-red-500
                "
              >
                <FaBullhorn />
              </div>

              <h2 className="mt-6 text-4xl font-extrabold text-red-500">
                {posts.length}
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-300">
                Latest Updates
              </p>

            </div>

          </div>

        </div>

        {/* ======================================= */}
        {/* LATEST POSTS */}
        {/* ======================================= */}

        <div className="mb-10 flex items-end justify-between">

          <div>

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Discover
            </span>

            <SectionTitle title="Latest Posts" />

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Stay updated with the latest news, announcements, events,
              scholarships, and academic information from Gunadarma University.
            </p>

          </div>

        </div>

                {!loading && posts.length > 0 && (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {posts.map((post) => (
                <div
                  key={post.id}
                  className="
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:scale-[1.02]
                  "
                >
                  <PostCard post={post} />
                </div>
              ))}

            </div>

            <div className="mt-14 flex justify-center">
              <Pagination
                page={page}
                total={count}
                limit={6}
                onPageChange={setPage}
              />
            </div>
          </>
        )}

        {!loading && posts.length === 0 && (
          <div className="mt-16">
            <EmptyState />
          </div>
        )}

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="
                  h-[380px]
                  animate-pulse
                  rounded-3xl
                  bg-slate-200

                  dark:bg-slate-800
                "
              />
            ))}

          </div>
        )}

        {/* ======================================= */}
        {/* CATEGORY SECTIONS */}
        {/* ======================================= */}

        <div className="mt-28">

          <div className="mb-14 text-center">

            <span
              className="
                rounded-full
                bg-blue-100
                px-4
                py-2
                text-sm
                font-semibold
                text-blue-700

                dark:bg-blue-900
                dark:text-blue-300
              "
            >
              Browse Categories
            </span>

            <h2
              className="
                mt-5
                text-4xl
                font-extrabold
                text-slate-900

                dark:text-white
              "
            >
              Explore Campus Information
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-2xl
                text-slate-500

                dark:text-slate-400
              "
            >
              Temukan berbagai informasi penting mulai dari
              pengumuman kampus, berita terbaru, agenda kegiatan,
              beasiswa, kalender akademik hingga surat edaran.
            </p>

          </div>

          <div className="space-y-24">

            {!loadingCategories &&
              categories.map((category) => (

                <section
                  key={category.id}
                  className="
                    rounded-[32px]
                    border
                    border-slate-200
                    bg-white
                    p-10
                    shadow-xl

                    transition-all
                    duration-300

                    hover:shadow-2xl

                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >

                  <CategorySection
                    title={category.name}
                    slug={category.slug}
                    viewAllLink={`/category/${category.slug}`}
                  />

                </section>

              ))}

          </div>

        </div>

        {/* ======================================= */}
        {/* FOOTER INFO */}
        {/* ======================================= */}

        <div
          className="
            mt-28
            rounded-[40px]
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-sky-600

            p-14
            text-center
            text-white
            shadow-2xl
          "
        >

          <h2>
          {settings.site_name}
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-3xl
              text-lg
              text-blue-100
            "
          >
            {settings.footer_text}
          </p>

          <div
            className="
              mt-10
              flex
              flex-wrap
              justify-center
              gap-5
            "
          >

            <div
              className="
                rounded-2xl
                bg-white/15
                px-8
                py-5
                backdrop-blur
              "
            >
              <h3 className="text-3xl font-bold">
                {count}+
              </h3>

              <p className="text-sm text-blue-100">
                Published Articles
              </p>
            </div>

            <div
              className="
                rounded-2xl
                bg-white/15
                px-8
                py-5
                backdrop-blur
              "
            >
              <h3 className="text-3xl font-bold">
                {categories.length}
              </h3>

              <p className="text-sm text-blue-100">
                Categories
              </p>
            </div>

            <div
              className="
                rounded-2xl
                bg-white/15
                px-8
                py-5
                backdrop-blur
              "
            >
              <h3 className="text-3xl font-bold">
                24/7
              </h3>

              <p className="text-sm text-blue-100">
                Information Access
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HomePage;