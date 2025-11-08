const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL ??
  (typeof process !== 'undefined' ? process.env.VITE_API_BASE_URL : undefined) ??
  'http://localhost:8080'

class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const getStoredToken = () => {
  try {
    return localStorage.getItem('authToken')
  } catch (error) {
    console.error('Failed to read auth token', error)
    return null
  }
}

const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  } catch (error) {
    console.error('Failed to persist auth token', error)
  }
}

const request = async (path, { method = 'GET', body, headers, auth = true } = {}) => {
  const token = auth ? getStoredToken() : null

  const mergedHeaders = new Headers(headers || {})

  if (body !== undefined && !mergedHeaders.has('Content-Type')) {
    mergedHeaders.set('Content-Type', 'application/json')
  }

  if (auth && token && !mergedHeaders.has('Authorization')) {
    mergedHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: mergedHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = isJson && data?.error ? data.error : response.statusText
    throw new ApiError(message || 'Request failed', response.status, data)
  }

  return data
}

export { request, getStoredToken, setStoredToken, ApiError }

