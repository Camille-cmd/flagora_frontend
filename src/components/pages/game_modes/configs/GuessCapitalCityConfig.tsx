import {Globe} from "lucide-react";
import GameService from "../../../../services/GameService";
import type {GameModeConfig} from "../BaseGameMode";
import type {City} from "../../../../interfaces/city";
import type {CountriesType} from "../../../../interfaces/country";

// Extended config that handles both cities and countries
interface CapitalCityOptions {
    cities: City
    countries: CountriesType
}

export const guessCapitalCityConfig: GameModeConfig<CapitalCityOptions> = {
    loadOptions: async (): Promise<CapitalCityOptions> => {
        const [cities, countries] = await Promise.all([
            GameService.getCities(),
            GameService.getCountries()
        ])
        return {cities, countries}
    },

    getSearchOptions: (options: CapitalCityOptions) => options?.cities || {},

    renderQuestion: (currentQuestion: string, options: CapitalCityOptions) => {
        if (!options || !options.countries) {
            return (
                <div className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200">
                    {currentQuestion}
                </div>
            )
        }

        const countryName = Object.keys(options.countries).find(
            key => options.countries[key] === currentQuestion
        )

        return (
            <div className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200">
                {countryName || currentQuestion}
            </div>
        )
    },

    validateAnswer: (answer: string, options: CapitalCityOptions): string | null => {
        if (!options?.cities || !options.cities[answer]) {
            return 'game.error.invalidCity'
        }
        return null
    },

    placeholder: "game.answer.cityPlaceholder",
    errorKey: "game.error.invalidCity",
    fallbackIcon: <Globe className="w-12 h-12"/>,

    getAnswerValue: (answer: string, options: CapitalCityOptions) => {
        return options?.cities?.[answer]
    }
}
