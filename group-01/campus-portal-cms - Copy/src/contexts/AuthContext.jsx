import {
  createContext,
  useState,
  useEffect,
} from 'react'

import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  onAuthStateChange,
} from '../services/authService.js'

// ======================================================
// Auth Context
// ======================================================

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
})

// ======================================================
// Provider
// ======================================================

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ==========================================
  // Login
  // ==========================================

  async function login(email, password) {
    await loginService(email, password)

    const currentUser = await getCurrentUser()

    setUser(currentUser)
  }

  // ==========================================
  // Logout
  // ==========================================

  async function logout() {
    await logoutService()

    setUser(null)
  }

  // ==========================================
  // Initial Session
  // ==========================================

  useEffect(() => {

    async function initialize() {

      try {

        const currentUser = await getCurrentUser()

        setUser(currentUser)

      } finally {

        setLoading(false)

      }

    }

    initialize()

    // Listen login/logout changes

    const {
      data: { subscription },
    } = onAuthStateChange((session) => {

      setUser(session?.user ?? null)

    })

    return () => {

      subscription.unsubscribe()

    }

  }, [])

  const value = {

    user,

    loading,

    login,

    logout,

  }

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  )

}