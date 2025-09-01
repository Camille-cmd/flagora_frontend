import api from "./api/api.tsx";
import {extractErrorMessage} from "./utils/errorHandler.tsx";
import i18n from "../i18n/i18n.tsx";
import {City} from "../interfaces/city.tsx";
import {CountriesType} from "../interfaces/country.tsx";

export default class GameService {
    static async getCountries(): Promise<CountriesType> {
        try {
            const response = await api.get('country/list')
            return response.data as CountriesType;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }

    static async getCities(): Promise<City> {
        try {
            const response = await api.get('city/list')
            return response.data as City;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, i18n.t('errors.generic')));
        }
    }
}
