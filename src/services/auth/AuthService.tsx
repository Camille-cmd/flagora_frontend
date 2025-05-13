import api from "../api/api.tsx"
import type {LoginResponse, User} from "../../interfaces/apiResponse.tsx"
import axios from "axios";


export default class AuthService {
    public static tokenKey = 'sessionid';

    static async login(email: string, password: string): Promise<User> {
        try {
            const response = await api.post<LoginResponse>('auth/login', {
                email,
                password,
            });
            const sessionId = response.data.sessionId;
            localStorage.setItem(this.tokenKey, sessionId)

            // Get user info
            return await this.getCurrentUser();

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const message =
                    error.response.data.message ??
                    error.message ??
                    'Login failed';

                throw new Error(message);
            } else {
                throw error;
            }
        }
    }

    static async getCurrentUser(): Promise<User> {
        try {
            const response = await api.get<User>('auth/me');

            console.log(response.data)

            return {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
            } as User;

        } catch (error: unknown) {
            // TODO : dry
            if (axios.isAxiosError(error) && error.response) {
                const message =
                    error.response.data.message ??
                    error.message ??
                    'Login failed';

                throw new Error(message);
            } else {
                throw error;
            }
        }
    }

    static async register(username: string, email: string, password: string): Promise<User> {
        try {
            const response = await api.post<User>('auth/register', {
                username,
                email,
                password,
            });

            return {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
            } as User;

        } catch (error: unknown) {
            // TODO : dry
            if (axios.isAxiosError(error) && error.response) {
                const message =
                    error.response.data.message ??
                    error.message ??
                    'Login failed';

                throw new Error(message);
            } else {
                throw error;
            }
        }
    }

    static async logout(): Promise<void> {
        try {
            await api.get('auth/logout');
            localStorage.removeItem(this.tokenKey);
        } catch (error: unknown) {
            // TODO : dry
            if (axios.isAxiosError(error) && error.response) {
                const message =
                    error.response.data.message ??
                    error.message ??
                    'Login failed';

                throw new Error(message);
            } else {
                throw error;
            }
        }

    }
}
