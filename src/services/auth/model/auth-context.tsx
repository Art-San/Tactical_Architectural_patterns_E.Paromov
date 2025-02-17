import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  createContext
} from 'react'
import { User } from './types'
import { authApi } from './api'

// export interface User {
//   id: number
//   email: string
//   username: string
//   password: string
// }

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = 'http://localhost:3001'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
  }, [])

  useEffect(() => {
    authApi
      .fetchUser()
      .then((user) => {
        setUser(user)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
      })
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      logout
    }),
    [user, loading, error, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
