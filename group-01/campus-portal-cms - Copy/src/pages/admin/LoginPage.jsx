import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'

import { useAuth } from '../../hooks/useAuth.js'

// ======================================================
// Admin Login Page
// ======================================================

function LoginPage() {
  const navigate = useNavigate()

  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await login(email, password)

      navigate('/admin/dashboard')

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">

      <h1 className="mb-6 text-2xl font-bold">

        Admin Login

      </h1>

      {error && (

        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">

          {error}

        </div>

      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          className="bg-gray-900 text-white"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

      </form>

    </div>
  )
}

export default LoginPage