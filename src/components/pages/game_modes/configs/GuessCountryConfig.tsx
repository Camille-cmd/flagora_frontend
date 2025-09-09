import {Flag} from "lucide-react";
import GameService from "../../../../services/GameService";
import type {GameModeConfig} from "../BaseGameMode";
import type {CountriesType} from "../../../../interfaces/country";

export const guessCountryConfig: GameModeConfig<CountriesType> = {
    loadOptions: (): Promise<CountriesType> => {
        return GameService.getCountries()
    },

    getSearchOptions: (options: CountriesType) => options || {},

    renderQuestion: (currentQuestion: string, _: CountriesType) => (
        <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(currentQuestion)}`}
            alt="Flag"
            className="max-h-full object-contain w-[100%]"
        />
    ),

    validateAnswer: (answer: string, options: CountriesType): string | null => {
        if (!options || !options[answer]) {
            return 'game.error.invalidCountry'
        }
        return null
    },

    placeholder: "game.answer.placeholder",
    errorKey: "game.error.invalidCountry",
    fallbackIcon: <Flag className="w-16 h-16"/>,

    getAnswerValue: (answer: string, options: CountriesType) => {
        return options?.[answer]
    }
}
