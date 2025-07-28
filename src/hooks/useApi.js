// hooks/useApi.js
import { useState } from 'react'
import axios from 'axios'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (config) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios(config)
      return { success: true, data: response.data }
    } catch (error) {
      let errorMessage = 'Error desconocido'
      
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || 'Error del servidor'
      } else if (error.request) {
        errorMessage = 'Error de conexión'
      } else {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const get = (url, config = {}) => request({ method: 'GET', url, ...config })
  const post = (url, data, config = {}) => request({ method: 'POST', url, data, ...config })
  const put = (url, data, config = {}) => request({ method: 'PUT', url, data, ...config })
  const del = (url, config = {}) => request({ method: 'DELETE', url, ...config })

  return {
    request,
    get,
    post,
    put,
    delete: del,
    loading,
    error,
    clearError: () => setError(null)
  }
}