// useAuth.js
// Convenience hook re-exporting the auth context. Keeps components
// from importing AuthContext directly.

import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext.jsx'

export function useAuth() {
  return useContext(AuthContext)
}
