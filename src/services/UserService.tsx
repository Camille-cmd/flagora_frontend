import api from "./api/api.tsx";
import axios from "axios";
import {extractErrorMessage} from "./utils/errorHandler.tsx";
import i18n from "../i18n/i18n.tsx";
import {UserStatsByGameMode} from "../interfaces/userStats.tsx";

export default class UserService {

    static async setLanguage(language: string): Promise<void> {
        try {
            await api.post('user/set-language', {language});
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error ?? error.response.data.code ?? 'Set language failed');
            } else {
                throw new Error('Set language failed');
            }
        }
    }

    static async getStats(): Promise<UserStatsByGameMode[]> {
        try {
            const response = await api.get('user/stats')
            return response.data as UserStatsByGameMode[];
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }
}
