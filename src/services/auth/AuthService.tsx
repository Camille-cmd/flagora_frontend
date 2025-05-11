import api from "../api/api.tsx"
import type { User, LoginResponse, RegisterResponse, ProfileResponse } from "../../interfaces/apiResponse.tsx"

// Token storage key
const TOKEN_KEY = "sessionid"
const USER_KEY = "userdata"

// Get the stored token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// Store authentication data
export const setAuthData = (sessionId: string, user: User): void => {
  localStorage.setItem(TOKEN_KEY, sessionId)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Clear authentication data
export const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Hook for user login
 */
export const useLogin = () => {
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", { email, password }).then((response) => {
      setAuthData(response.data.sessionId, response.data.user)
      return response.data as LoginResponse
    })
  }

  return { login }
}

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const register = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register", { username, email, password }).then((response) => {
      setAuthData(response.data.sessionId, response.data.user)
      return response.data
    })
  }

  return { register }
}

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const logout = async (): Promise<void> => {
    const token = getToken()

    // Only make the API call if we have a token
    const logoutPromise = token ? api.get("/auth/logout", {}) : Promise.resolve()

    return logoutPromise
      .then(() => {
        clearAuthData()
      })
      .catch((error) => {
        // Even if the API call fails, we still want to clear local data
        console.error("Logout error:", error)
        clearAuthData()
      })
  }

  return { logout }
}

/**
 * Hook for password reset request
 */
export const useRequestPasswordReset = () => {
  const requestReset = async (email: string): Promise<void> => {
    return api.post("/auth/reset-password", { email }).then(() => {
      // Nothing to return, just a successful request
    })
  }

  return { requestReset }
}

/**
 * Hook for confirming password reset
 */
export const useConfirmPasswordReset = () => {
  const confirmReset = async (token: string, newPassword: string): Promise<void> => {
    return api.post("/auth/reset-password/confirm", { token, password: newPassword }).then(() => {
      // Nothing to return, just a successful request
    })
  }

  return { confirmReset }
}

/**
 * Hook for getting current user profile
 */
export const useGetCurrentUser = () => {
  const getCurrentUser = async (): Promise<User> => {
    return api.get<ProfileResponse>("/auth/me").then((response) => {
      // Update stored user data with latest from server
      const userData = response.data.user
      const token = getToken()
      if (token) {
        setAuthData(token, userData)
      }
      return userData
    })
  }

  return { getCurrentUser }
}

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = () => {
  const updateProfile = async (userData: Partial<User>): Promise<User> => {
    return api.put<ProfileResponse>("/auth/profile", userData).then((response) => {
      // Update stored user data
      const updatedUser = response.data.user
      const token = getToken()
      if (token) {
        setAuthData(token, updatedUser)
      }
      return updatedUser
    })
  }

  return { updateProfile }
}

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    return api.post("/auth/change-password", { currentPassword, newPassword }).then(() => {
      // Nothing to return, just a successful request
    })
  }

  return { changePassword }
}
