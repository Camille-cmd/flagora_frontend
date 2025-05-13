// User interface
export interface User {
  id: string
  username: string
  email: string
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
