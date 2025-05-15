import api from "./api/api.tsx";
import axios from "axios";

export default class UserService {

    static async setLanguage(language: string): Promise<void> {
        try {
            await api.post('user/set-language', { language });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error ?? error.response.data.code ?? 'Set language failed');
            } else {
                console.error(error)
                throw new Error('Set language failed');
            }
        }
    }
}
