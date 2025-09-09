import BaseGameMode, {BaseGameModeProps} from "./BaseGameMode";
import {guessCapitalCityConfig} from "./configs/GuessCapitalCityConfig";
import type {City} from "../../../interfaces/city";
import type {CountriesType} from "../../../interfaces/country";

type CapitalCityOptions = {
    cities: City
    countries: CountriesType
}

// Config is changed for each mode
type GuessCapitalCityModeProps = Omit<BaseGameModeProps<CapitalCityOptions>, 'config'>

export default function GuessCapitalCityMode(props: GuessCapitalCityModeProps) {
    return <BaseGameMode<CapitalCityOptions> {...props} config={guessCapitalCityConfig}/>
}
