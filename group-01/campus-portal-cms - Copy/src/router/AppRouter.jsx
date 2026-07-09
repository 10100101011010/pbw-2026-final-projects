import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import HomePage from '../pages/public/HomePage.jsx'
import PostDetailPage from '../pages/public/PostDetailPage.jsx'
import SearchResultPage from '../pages/public/SearchResultPage.jsx'
import NotFoundPage from '../pages/public/NotFoundPage.jsx'
import CategoryPage from '../pages/public/CategoryPage.jsx'

import LoginPage from '../pages/admin/LoginPage.jsx'
import DashboardPage from '../pages/admin/DashboardPage.jsx'
import PostsPage from '../pages/admin/PostsPage.jsx'
import CreatePostPage from '../pages/admin/CreatePostPage.jsx'
import EditPostPage from '../pages/admin/EditPostPage.jsx'
import CategoriesPage from '../pages/admin/CategoriesPage.jsx'
import SettingsPage from '../pages/admin/SettingsPage.jsx'
import ProfilePage from '../pages/admin/ProfilePage.jsx'

// Central route definitions for the whole app.
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
              path="/category/:slug"
              element={<CategoryPage />}
          />
          <Route path="/post/:slug" element={<PostDetailPage />} />
          <Route path="/search" element={<SearchResultPage />} />
        </Route>

        {/* Admin auth (no layout / no protection) */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin dashboard (protected) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/posts" element={<PostsPage />} />
            <Route path="/admin/posts/create" element={<CreatePostPage />} />
            <Route path="/admin/posts/:id/edit" element={<EditPostPage />} />
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
