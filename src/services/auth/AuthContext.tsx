// import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
// import {useUser} from "./useUser.tsx";
// import {UserInfo} from "../../interfaces/userInfo.tsx";
//
//
// // Create the context
// const AuthContext = createContext<UserInfo | undefined>(undefined);
//
// /*
//     Provider component: gives whatever children it has the isLoggedIn values. Use the Provider to Wrap Components
//  */
// export const AuthProvider = ({children}: { children: ReactNode }) => {
//     const {User} = useUser();
//
//     const [userInfo, setUserInfos] = useState<UserInfo | undefined>(undefined);
//
//     useEffect(() => {
//         User()
//             .then(
//                 (response) => {
//                     setUserInfos({
//                         username: response.username,
//                         email: response.email,
//                         userId: response.userId,
//                     });
//                 }
//             )
//             .catch(error => {
//                 console.error("Failed to fetch user data:", error);
//                 // Optionally handle error (e.g., logout, show message, etc.)
//                 setUserInfos(undefined);
//             })
//
//     }, []);
//
//     return (
//         <AuthContext.Provider value={userInfo}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// /*
//     Hook that gives components access to the current context value.
//     Used to consume the context in any component that needs the data.
//  */
// export const useAuthContext = (): UserInfo | undefined  => {
//     return useContext(AuthContext);
// };


import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type {User} from "../../interfaces/apiResponse.tsx"
import { isAuthenticated, useLogin, useRegister, useLogout, useUpdateProfile, useGetCurrentUser } from "./AuthService"

// Define the shape of our context
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null)

// Props for the provider component
interface AuthProviderProps {
  children: ReactNode
}

// Provider component that wraps the app
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize hooks
  const { login: loginService } = useLogin()
  const { register: registerService } = useRegister()
  const { logout: logoutService } = useLogout()
  const { updateProfile } = useUpdateProfile()
  const { getCurrentUser } = useGetCurrentUser()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      if (isAuthenticated()) {
        getCurrentUser()
          .then((userData: User) => {
            setUser(userData)
          })
          .catch((error) => {
            console.error("Auth check failed:", error)
            // If getting current user fails, clear auth data
            logoutService()
            setUser(null)
          })
          .finally(() => {
            setIsLoading(false)
          })
      } else {
        setUser(null)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    return loginService(email, password)
      .then((response: any) => {
        setUser(response.user)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)

    return registerService(username, email, password)
      .then((response) => {
        setUser(response.user)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)

    return logoutService()
      .then(() => {
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Update user data
  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true)

    return updateProfile(userData)
      .then((updatedUser) => {
        setUser(updatedUser)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Value object that will be passed to consumers
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook for using the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

// Export the context for direct usage if needed
export default AuthContext
