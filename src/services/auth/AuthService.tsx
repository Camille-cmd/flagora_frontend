import api from "../api/api.tsx"
import {IsUserAvailableResponse, LoginResponse, User} from "../../interfaces/apiResponse.tsx"
import axios from "axios";
import i18n from "../../i18n/i18n.tsx";
import {extractErrorMessage} from "../utils/errorHandler.tsx";
import {GameModes} from "../../interfaces/gameModes.tsx";


export default class AuthService {
    public static tokenKey = 'flagorasessionid';

    public static get isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    public static get token(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    public static cleanToken(): void {
        localStorage.removeItem(this.tokenKey)
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
            throw new Error(extractErrorMessage(error, i18n.t('errors.loginFailed')));
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
                language: response.data.language,
                tooltipPreferences: response.data.tooltipPreferences
            } as User;

        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }

    static async register(email: string, username: string, password: string): Promise<User> {
        try {
            const language = i18n.language;
            const response = await api.post<User>('auth/register', {
                username,
                email,
                password,
                language
            });

            return {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                isEmailVerified: response.data.isEmailVerified,
                language: response.data.language
            } as User;

        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.registerFailed')));
        }
    }

    static async logout(): Promise<void> {
        try {
            await api.get('auth/logout');
            localStorage.removeItem(this.tokenKey);
        } catch (error: unknown) {
            // If the logout fails, we still want to remove the sessionId from localStorage to avoid logging loop
            localStorage.removeItem(this.tokenKey);
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }

    }

    static async isUserNameAvailable(username: string): Promise<boolean> {
        try {
            const response = await api.post<IsUserAvailableResponse>(
                'auth/check_username', {username}
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
                throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
            }
        }
    }

    static async resetPassword(email: string): Promise<void> {
        try {
            await api.post('auth/reset_password', {email});
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const message =
                    error.response.data.message ??
                    error.message ??
                    'Reset password failed';

                throw new Error(message);
            } else {
                throw new Error(extractErrorMessage(error, i18n.t('errors.resetPasswordFailed')));
            }
        }
    }

    static async resetPasswordValidate(uid: string, token: string): Promise<void> {
        try {
            await api.get(`/auth/reset_password_validate`, {
                params: {uid, token},
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const codeStr = error.response.data.code;
                throw new Error(codeStr);
            } else {
                throw new Error(extractErrorMessage(error, i18n.t('errors.resetPasswordValidateFailed')));
            }
        }
    }

    static async resetPasswordConfirm(uid: string, token: string, password: string): Promise<void> {
        try {
            await api.post('auth/reset_password_confirm', {uid, token, password});
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.resetPasswordConfirmFailed')));
        }
    }

    static async sendVerificationEmail(): Promise<void> {
        try {
            await api.get(`/auth/email-verify`);
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }

    static async verifyEmail(uid: string, token: string): Promise<void> {
        try {
            await api.get(`/auth/email-verify/validate`, {
                params: {uid, token},
            });
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }

    static async updateUser(username: string): Promise<User> {
        try {
            const response = await api.put('user/', {
                username,
            });

            return {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                isEmailVerified: response.data.isEmailVerified,
                language: response.data.language
            } as User;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }

    static async updateUserPreferences(showTips: boolean, gameMode: GameModes): Promise<User> {
        try {
            const response = await api.put('user/me/', {
                showTips, gameMode
            });

            return {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                isEmailVerified: response.data.isEmailVerified,
                language: response.data.language
            } as User;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }

    static async updateUserPassword(oldPassword: string, newPassword: string): Promise<void> {
        try {
            await api.put('user/password', {
                oldPassword,
                newPassword,
            });
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }
}
