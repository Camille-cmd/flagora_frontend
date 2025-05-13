import type React from "react"
import {createContext, type ReactNode, useContext, useEffect, useState} from "react"
import AuthService from "../services/auth/AuthService.tsx";
import {User} from "../interfaces/apiResponse.tsx";

// Define the shape of our context
interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    // updateUser: (userData: Partial<User>) => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null)

// Props for the provider component
interface AuthProviderProps {
    children: ReactNode
}

// Provider component that wraps the app
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null)

    // Check authentication status on mount
    useEffect(() => {
        if (user) {
            AuthService.getCurrentUser()
                .then((userData: User) => {
                    setUser(userData)
                })
                .catch(() => {
                    // If getting current user fails, clear auth data
                    AuthService.logout().then(() => setUser(null));
                })
        }
    }, [])

    const login = async (email: string, password: string): Promise<void> => {
        const user = await AuthService.login(email, password);
        setUser(user);
    };

    const register = async (username: string, email: string, password: string): Promise<void> => {
        const user = await AuthService.register(username, email, password);
        setUser(user);
    }

    const logout = async (): Promise<void> => {
        await AuthService.logout();
        setUser(null);
    }

    // Value object that will be passed to consumers
    const value = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout
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
