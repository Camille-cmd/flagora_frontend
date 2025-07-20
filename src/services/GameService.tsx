import api from "./api/api.tsx";
import {extractErrorMessage} from "./utils/errorHandler.tsx";
import i18n from "../i18n/i18n.tsx";
import {Country} from "../interfaces/country.tsx";
import {City} from "../interfaces/city.tsx";

export default class GameService {
    static async getCountries(): Promise<Country[]> {
        try {
            const response = await api.get('country/list')
            return response.data.countries as Country[];
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }

    static async getCities(): Promise<City[]> {
        try {
            const response = await api.get('city/list')
            return response.data.cities as City[];
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }
}
