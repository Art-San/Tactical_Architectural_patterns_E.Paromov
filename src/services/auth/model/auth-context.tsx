// import { createStrictContext } from '@/shared/react'
// import { useAuth } from './use-auth'

// export const AuthContext = createStrictContext<ReturnType<typeof useAuth>>()

// import { useContext, createContext } from 'react'
// import { useAuth } from './use-auth'

// const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(
//   undefined
// )

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children
// }) => {
//   const value = useAuth()

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export const useAuthContext = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }
