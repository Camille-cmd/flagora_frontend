import BaseGameMode, {BaseGameModeProps} from "./BaseGameMode";
import {guessCountryConfig} from "./configs/GuessCountryConfig";
import type {CountriesType} from "../../../interfaces/country";

type GuessCountryModeProps = Omit<BaseGameModeProps<CountriesType>, 'config'>

export default function GuessCountryMode(props: GuessCountryModeProps) {
    return <BaseGameMode<CountriesType> {...props} config={guessCountryConfig} />
}