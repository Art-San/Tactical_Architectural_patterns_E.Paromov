import { useEffect, useState, startTransition } from 'react'
import { authApi } from './api'
import { LoginPayload, RegisterPayload, User } from './types'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/kernel/routes'
import { createHookContext } from '@/shared/react'

function useAuthHook() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigation = useNavigate()

  const logout = () => {
    authApi.logout()
    startTransition(() => setUser(null))
    navigation(routes.login)
  }

  const login = async (login: LoginPayload) => {
    const user = await authApi.login(login)
    startTransition(() => setUser(user))
    navigation(routes.home)
  }

  const register = async (register: RegisterPayload) => {
    const user = await authApi.register(register)
    startTransition(() => setUser(user))
    navigation(routes.home)
  }

  useEffect(() => {
    authApi
      .fetchUser()
      .then((user) => {
        setUser(user)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return {
    user,
    loading,
    error,
    logout,
    login,
    register
  }
}

export const { use: useAuth, Provider: AuthProvider } =
  createHookContext(useAuthHook)
