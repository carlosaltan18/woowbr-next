// Actualizar useLogin para usar useAuth
import { useAuth } from '@/hooks/useAuth'
import { useApi } from '@/hooks/useApi'

export const useLogin = () => {
  const { login: setAuthUser } = useAuth()
  const { post, loading, error, clearError } = useApi()

  const login = async (credentials) => {
    const result = await post('api/user/login', credentials)
    
    if (result.success) {
      setAuthUser(result.data.user, result.data.token)
    }
    
    return result
  }

  return { login, isLoading: loading, error, clearError }
}