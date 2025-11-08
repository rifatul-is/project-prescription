import { request, setStoredToken, getStoredToken } from '../lib/api'

const login = async (credentials) => {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: credentials,
    auth: false,
  })

  if (data?.token) {
    setStoredToken(data.token)
  }

  return data
}

const logout = () => {
  setStoredToken(null)
}

const getProfile = async () => {
  if (!getStoredToken()) {
    return null
  }

  return request('/api/auth/me')
}

export { login, logout, getProfile }

