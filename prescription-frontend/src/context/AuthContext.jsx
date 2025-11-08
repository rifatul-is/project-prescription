import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginService, logout as logoutService, getProfile } from '../services/auth'

const AuthContext = createContext(undefined)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const profile = await getProfile()
        setUser(profile)
      } catch (err) {
        console.warn('Auth bootstrap failed', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  const login = async (credentials) => {
    const data = await loginService(credentials)
    setUser({ username: data?.username })
    return data
  }

  const logout = () => {
    logoutService()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth }

