// User interface
import {GameModes} from "./gameModes.tsx";

export interface TooltipPreferences {
    showTips: boolean
    gameMode: GameModes
}

export interface User {
    id: string
    username: string
    email: string
    language: string
    isEmailVerified: boolean
    tooltipPreferences: Array<TooltipPreferences>
}

// Login response
export interface LoginResponse {
    sessionId: string
}

// Register response
export interface RegisterResponse {
    user: User
    sessionId: string
}

// Profile response
export interface ProfileResponse {
    user: User
}

export interface IsUserAvailableResponse {
    available: boolean
}

export interface BackendErrorResponse {
    errorMessage: string
}
