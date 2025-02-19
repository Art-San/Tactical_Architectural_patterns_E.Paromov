import { useSyncExternalStore } from 'react'
import { authApi } from './api'
import { LoginPayload, RegisterPayload, User } from './types'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/kernel/routes'
import { createGlobalStore } from '@/shared/global-store'

const userGlobalState = createGlobalStore<User | null>(null)

export const fetchUser = async () => {
  let user = userGlobalState.getSnapshot()

  if (!user) {
    user = await authApi.fetchUser().catch(() => null)
    if (user) {
      userGlobalState.set(user)
    }
  }

  return user
}

export const checkIsAuth = async () => {
  const user = await fetchUser()
  return !!user
}

export function useAuth() {
  const user = useSyncExternalStore(
    userGlobalState.subscribe,
    userGlobalState.getSnapshot
  )

  const navigation = useNavigate()

  const logout = () => {
    authApi.logout()
    userGlobalState.set(null)
    //startTransition(() => setUser(null)) // сказал что не получится сделать startTransition
    navigation(routes.login)
  }

  const login = async (login: LoginPayload) => {
    const user = await authApi.login(login)
    userGlobalState.set(user)
    // startTransition(() => setUser(user))  // сказал что не получится сделать startTransition
    navigation(routes.home)
  }

  const register = async (register: RegisterPayload) => {
    const user = await authApi.register(register)
    userGlobalState.set(user)
    // startTransition(() => setUser(user))
    navigation(routes.home)
  }

  // на 46:20 пришел к выводу что useEffect не нужен
  // useEffect(() => {
  //   authApi
  //     .fetchUser()
  //     .then((user) => {
  //       userGlobalState.set(user)
  //       setLoading(false)
  //     })
  //     .catch((err) => {
  //       setError(err)
  //       setLoading(false)
  //     })
  // }, [])

  return {
    user,
    // loading,
    // error,
    logout,
    login,
    register
  }
}

// если использую глобал стейт провайдер не нужен
// export const { use: useAuth, Provider: AuthProvider } =
//   createHookContext(useAuthHook)
