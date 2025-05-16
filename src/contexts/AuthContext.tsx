import type React from "react"
import {createContext, type ReactNode, useEffect, useState} from "react"
import AuthService from "../services/auth/AuthService.tsx";
import {User} from "../interfaces/apiResponse.tsx";

// Define the shape of our context
interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    isUserNameAvailable : (username: string) => Promise<boolean>
    resetPassword : (email: string) => Promise<void>
    resetPasswordConfirm : (uid: string, token: string, newPassword: string) => Promise<void>
    resetPasswordValidate : (uid: string | undefined, token: string | undefined) => Promise<void>
    verifyEmail : (uid: string| undefined, token: string | undefined) => Promise<void>
    sendVerificationEmail : () => Promise<void>
    updateUser : (username: string) => Promise<void>
    updateUserPassword : (oldPassword: string, newPassword: string) => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null)

    // Check authentication status on mount
    useEffect(() => {
        if (!user) {
            AuthService.getCurrentUser()
                .then((userData: User) => {
                    setUser(userData)
                })
                .catch(() => {
                    // session probably expired
                    setUser(null);
                })
        }
    }, [user])

    const login = async (email: string, password: string): Promise<void> => {
        const user = await AuthService.login(email, password);
        setUser(user);
    };

    const register = async (email: string, username: string, password: string): Promise<void> => {
        const user = await AuthService.register(email, username, password);
        setUser(user);
    }

    const logout = async (): Promise<void> => {
        await AuthService.logout();
        setUser(null);
    }

    const isUserNameAvailable = async (username: string): Promise<boolean> => {
        return await AuthService.isUserNameAvailable(username);
    }

    const resetPassword = async (email: string): Promise<void> => {
        await AuthService.resetPassword(email);
    }

    const resetPasswordConfirm = async (uid: string, token: string, newPassword: string): Promise<void> => {
        await AuthService.resetPasswordConfirm(uid, token, newPassword);
    }

    const resetPasswordValidate = async (uid: string | undefined, token: string | undefined): Promise<void> => {
        return await AuthService.resetPasswordValidate(uid || "", token || "");
    }

    const verifyEmail = async (uid: string | undefined, token: string | undefined): Promise<void> => {
        await AuthService.verifyEmail(uid || "", token || "");
    }

    const sendVerificationEmail = async (): Promise<void> => {
        await AuthService.sendVerificationEmail();
    }

    const updateUser = async (username: string): Promise<void> => {
        const user = await AuthService.updateUser(username);
        setUser(user);
    }

    const updateUserPassword = async (oldPassword: string, newPassword: string): Promise<void> => {
        await AuthService.updateUserPassword(oldPassword, newPassword);
    }

    // Value object that will be passed to consumers
    const value = {
        user,
        isAuthenticated: AuthService.isAuthenticated,
        login,
        register,
        logout,
        isUserNameAvailable,
        resetPassword,
        resetPasswordConfirm,
        resetPasswordValidate,
        verifyEmail,
        sendVerificationEmail,
        updateUser,
        updateUserPassword
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Export the context for direct usage if needed
export default AuthContext
