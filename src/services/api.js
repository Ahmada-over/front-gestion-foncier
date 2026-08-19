const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD 
  ? 'https://gestion-foncier-346078879462.europe-west1.run.app/api/v1' 
  : 'http://localhost:8005/api/v1')

const getToken = () => localStorage.getItem('access_token')
const setToken = (token) => localStorage.setItem('access_token', token)
const removeToken = () => localStorage.removeItem('access_token')

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      removeToken()
      // Avoid redirect loop: only redirect if not already on login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
      throw new Error('Session expirée')
    }
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Une erreur est survenue')
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  if (options.responseType === 'blob') {
    return response.blob()
  }

  return response.json()
}

const downloadFile = (endpoint, filename) => {
  const token = getToken()
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${API_URL}${endpoint}${separator}token=${token}&t=${Date.now()}`
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'document.pdf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const getFileBlobUrl = (endpoint) => {
  const token = getToken()
  const separator = endpoint.includes('?') ? '&' : '?'
  return `${API_URL}${endpoint}${separator}token=${token}`
}

export const api = {
  auth: {
    login: async (email, password) => {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      if (data.access_token) {
        setToken(data.access_token)
      }
      return data
    },
    logout: () => {
      removeToken()
    },
    getMe: () => request('/auth/me'),
    isAuthenticated: () => !!getToken()
  },
  actes: {
    getAll: (skip = 0, limit = 100) => request(`/actes/?skip=${skip}&limit=${limit}`),
    getById: (id) => request(`/actes/${id}`),
    create: (data) => request('/actes/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/actes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    valider: (id) => request(`/actes/${id}/valider`, { method: 'POST' }),
    downloadPdf: (id, filename) => downloadFile(`/actes/${id}/pdf`, filename),
    getQrcodeImage: async (id) => {
      const blob = await request(`/actes/${id}/qrcode`, { responseType: 'blob' })
      return URL.createObjectURL(blob)
    },
    getQrcodeUrl: (id) => getFileBlobUrl(`/actes/${id}/qrcode`),
    downloadPdfUrl: (id) => `${API_URL}/actes/${id}/pdf`, // Deprecated, use downloadPdf
    qrcodeUrl: (id) => `${API_URL}/actes/${id}/qrcode`   // Deprecated, use getQrcodeUrl
  },
  certificats: {
    getAll: (skip = 0, limit = 100) => request(`/certificats/?skip=${skip}&limit=${limit}`),
    getById: (id) => request(`/certificats/${id}`),
    create: (data) => request('/certificats/', { method: 'POST', body: JSON.stringify(data) }),
    valider: (id) => request(`/certificats/${id}/valider`, { method: 'POST' }),
    revoquer: (id) => request(`/certificats/${id}/revoquer`, { method: 'POST' }),
    downloadPdf: (id, filename) => downloadFile(`/certificats/${id}/pdf`, filename),
    getQrcodeImage: async (id) => {
      const blob = await request(`/certificats/${id}/qrcode`, { responseType: 'blob' })
      return URL.createObjectURL(blob)
    },
    getQrcodeUrl: (id) => getFileBlobUrl(`/certificats/${id}/qrcode`),
    downloadPdfUrl: (id) => `${API_URL}/certificats/${id}/pdf`, // Deprecated
    qrcodeUrl: (id) => `${API_URL}/certificats/${id}/qrcode`   // Deprecated
  },
  parcelles: {
    getAll: (skip = 0, limit = 100, numero_parcelle = '', sans_certificat = false) => {
      let url = `/parcelles/?skip=${skip}&limit=${limit}`
      if (numero_parcelle) url += `&numero_parcelle=${encodeURIComponent(numero_parcelle)}`
      if (sans_certificat) url += `&sans_certificat=true`
      return request(url)
    },
    getById: (id) => request(`/parcelles/${id}`),
    create: (data) => request('/parcelles/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/parcelles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/parcelles/${id}`, { method: 'DELETE' })
  },
  proprietaires: {
    getAll: (skip = 0, limit = 100, nom = '', cin = '') => {
      let url = `/proprietaires/?skip=${skip}&limit=${limit}`
      if (nom) url += `&nom=${encodeURIComponent(nom)}`
      if (cin) url += `&cin=${encodeURIComponent(cin)}`
      return request(url)
    },
    getById: (id) => request(`/proprietaires/${id}`),
    create: (data) => request('/proprietaires/', { method: 'POST', body: JSON.stringify(data) }),
    getParcelles: (id) => request(`/proprietaires/${id}/parcelles`),
    getActes: (id) => request(`/proprietaires/${id}/actes`),
    getStats: () => request('/proprietaires/stats')
  },
  patrimoine: {
    getStats: () => request('/patrimoine/stats'),
    getMembres: (skip = 0, limit = 100) => request(`/patrimoine/membres?skip=${skip}&limit=${limit}`),
    createMembre: (data) => request('/patrimoine/membres', { method: 'POST', body: JSON.stringify(data) }),
    getAffectations: (skip = 0, limit = 100) => request(`/patrimoine/affectations?skip=${skip}&limit=${limit}`),
    affecterParcelle: (data) => request('/patrimoine/affectations', { method: 'POST', body: JSON.stringify(data) })
  },
  decharges: {
    getAll: (skip = 0, limit = 100) => request(`/decharges/?skip=${skip}&limit=${limit}`),
    getById: (id) => request(`/decharges/${id}`),
    create: (data) => request('/decharges/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/decharges/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    valider: (id) => request(`/decharges/${id}/valider`, { method: 'POST' }),
    downloadPdf: (id, filename) => downloadFile(`/decharges/${id}/pdf`, filename),
    getQrcodeImage: async (id) => {
      const blob = await request(`/decharges/${id}/qrcode`, { responseType: 'blob' })
      return URL.createObjectURL(blob)
    },
    getQrcodeUrl: (id) => getFileBlobUrl(`/decharges/${id}/qrcode`)
  },
  utilisateurs: {
    getAll: (skip = 0, limit = 100) => request(`/utilisateurs/?skip=${skip}&limit=${limit}`),
    getById: (id) => request(`/utilisateurs/${id}`),
    create: (data) => request('/utilisateurs/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/utilisateurs/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  historique: {
    getAll: (skip = 0, limit = 100, table_cible = '', action = '') => {
      let url = `/historique/?skip=${skip}&limit=${limit}`
      if (table_cible) url += `&table_cible=${encodeURIComponent(table_cible)}`
      if (action) url += `&action=${encodeURIComponent(action)}`
      return request(url)
    }
  }
}
