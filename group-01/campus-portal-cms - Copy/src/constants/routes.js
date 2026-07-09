// Centralized route path constants. Import these instead of hardcoding
// path strings across the app.

export const PUBLIC_ROUTES = {
  HOME: '/',
  ANNOUNCEMENTS: '/announcements',
  NEWS: '/news',
  EVENTS: '/events',
  SCHOLARSHIPS: '/scholarships',
  ACADEMIC_CALENDAR: '/academic-calendar',
  CIRCULAR_LETTERS: '/circular-letters',
  POST_DETAIL: '/post/:slug',
  SEARCH_RESULT: '/search',
  NOT_FOUND: '*',
}

export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
  POSTS: '/admin/posts',
  CREATE_POST: '/admin/posts/create',
  EDIT_POST: '/admin/posts/:id/edit',
  CATEGORIES: '/admin/categories',
  SETTINGS: '/admin/settings',
  PROFILE: '/admin/profile',
}
