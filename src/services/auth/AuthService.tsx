import api from "../api/api.tsx"
import {IsUserAvailableResponse, LoginResponse, User} from "../../interfaces/apiResponse.tsx"
import axios from "axios";
import i18n from "../../i18n/i18n.tsx";


export default class AuthService {
    public static tokenKey = 'flagorasessionid';

    public static get isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

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
                throw new Error(error.response.data.error ?? error.response.data.code ?? 'Login failed');
            } else {
                console.error(error)
                throw new Error('Login failed');
            }
        }
    }

    static async getCurrentUser(): Promise<User> {
        if (!localStorage.getItem(this.tokenKey)) {
            throw new Error("No sessionId found");
        }
        try {
            const response = await api.get<User>('user/me');

            // Set the correct language if it is different from the one detected by i18n
            const current_lang = i18n.language
            const lang = response.data.language;
            if (response.data.language !== current_lang) {
                i18n.changeLanguage(response.data.language)
                    .then(() => {
                        i18n.changeLanguage(lang)
                    })
            }

            return {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                isEmailVerified: response.data.isEmailVerified,
                language: response.data.language
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

    static async register(email: string, username: string, password: string): Promise<User> {
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
            if (axios.isAxiosError(error) && error.response) {
                const codeStr = error.response.data.code;
                throw new Error(codeStr);
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

    static async isUserNameAvailable(username: string): Promise<boolean> {
        try {
            const response = await api.post<IsUserAvailableResponse>(
                'auth/check_username', { username }
            )
            return response.data.available;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const message =
                    error.response.data.message ??
                    error.message ??
                    'Check username failed';

                throw new Error(message);
            } else {
                throw error;
            }
        }
    }

    static async resetPassword(email: string): Promise<void> {
        try {
            await api.post('auth/reset_password', { email });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const message =
                    error.response.data.message ??
                    error.message ??
                    'Reset password failed';

                throw new Error(message);
            } else {
                throw error;
            }
        }
    }

    static async resetPasswordValidate(uid: string, token: string): Promise<void> {
        try {
           await api.get(`/auth/reset_password_validate`, {
                    params: { uid, token },
                });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const codeStr = error.response.data.code;
                throw new Error(codeStr);
            } else {
                throw error;
            }
        }
    }

    static async resetPasswordConfirm(uid: string, token: string, password: string): Promise<void> {
        try {
            await api.post('auth/reset_password_confirm', { uid, token, password });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const message =
                    error.response.data.message ??
                    error.message ??
                    'Reset password confirm failed';

                throw new Error(message);
            } else {
                throw error;
            }
        }
    }
}
